import { join } from 'path';
import semver, { ReleaseType } from 'semver';
import fs from 'fs';
import { execSync, exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec);

const comptimeCssPackageNames = [
  'comptime-css',
  'comptime-css-esbuild',
  'comptime-css-babel',
  'comptime-css-solid',
];

const packageToDir = {
  'comptime-css': 'comptime-css',
  'comptime-css-esbuild': 'esbuild',
  'comptime-css-babel': 'babel',
  'comptime-css-solid': 'solid',
};

const levels = ['minor', 'patch'];

function isValidLevel(level: string): level is 'minor' | 'patch' {
  return levels.includes(level);
}

async function main() {
  const packageName = process.argv[2];
  const level = process.argv[3] ?? 'patch';

  if (process.argv.length > 4) {
    console.error('More than one package specified');
    return;
  }

  if (
    !packageName ||
    !comptimeCssPackageNames.includes(packageName) ||
    !isValidLevel(level)
  ) {
    console.error(`Incorrect package: ${packageName}`);
    return;
  }

  console.log('-> Building packages...');
  execSync('yarn build', { encoding: 'utf8' });
  console.log('');

  const packageDir = join(
    process.cwd(),
    'packages',
    packageToDir[packageName as keyof typeof packageToDir]
  );

  let newVersion: string;
  console.log(`-> Updating package.json of ${packageName}...`);
  await updatePackageJson(packageDir, json => {
    const version = json.version;
    newVersion = semver.inc(version, level) ?? version;
    json.version = newVersion ?? version;
  });
  console.log('');

  if (typeof newVersion! === 'undefined') {
    console.error("Couldn't read updated version");
    return;
  }

  const packagesToPublish = new Set<string>([packageName]);

  console.log('-> Updating packages...');
  const packages = await fs.promises.readdir('packages');
  const packagesPromises = packages.map(async p => {
    const packageDir = join('packages', p);
    await updatePackageJson(packageDir, json => {
      for (const dep of Object.keys(json.dependencies)) {
        if (dep === packageName) {
          packagesToPublish.add(json.name);
          json.dependencies[dep] = newVersion;
        }
      }
    });
  });
  console.log('');

  await Promise.all(packagesPromises);

  console.log('-> Updating examples...');
  const examplesPromises = (await fs.promises.readdir('examples')).map(
    async example => {
      const packageDir = join('examples', example);
      await updatePackageJson(packageDir, json => {
        for (const dep of Object.keys(json.dependencies)) {
          if (dep === packageName) {
            json.dependencies[dep] = newVersion;
          }
        }
      });
    }
  );
  console.log('');

  await Promise.all(examplesPromises);

  execSync(
    `git add . && git commit -m "release: ${packageName}@${newVersion}"`
  );

  console.log('-> Publishing packages...');
  for (const dep of packagesToPublish) {
    if (!comptimeCssPackageNames.includes(dep)) {
      console.error(`Incorrect dependency: ${dep}`);
      process.exit(1);
    }

    const packageDir = join(
      process.cwd(),
      'packages',
      packageToDir[dep as keyof typeof packageToDir]
    );
    execSync(`cd ${packageDir} && npm publish`);
    console.log(`-> Published ${dep}@${newVersion}`);
  }
}

main();

type PackageJson = {
  name: string;
  version: string;
  dependencies: Record<string, string>;
};

async function updatePackageJson(
  dirPath: string,
  transform: (json: PackageJson) => void | Promise<void>
) {
  const packageJsonPath = join(dirPath, 'package.json');
  const jsonStr = await fs.promises.readFile(packageJsonPath, 'utf8');

  const json = JSON.parse(jsonStr);
  await transform(json);
  const stringified = `${JSON.stringify(json, null, 2)}\n`;

  if (jsonStr.trim() === stringified.trim()) return;

  await fs.promises.writeFile(packageJsonPath, stringified);
}
