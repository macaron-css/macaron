import fs from 'fs';
import { join } from 'path';
import semver from 'semver';

const macaronPackageNames = [
  '@macaron-css/core',
  '@macaron-css/integration',
  '@macaron-css/esbuild',
  '@macaron-css/babel',
  '@macaron-css/solid',
  '@macaron-css/react',
  '@macaron-css/vite',
];

const packageToDir = {
  '@macaron-css/core': 'core',
  '@macaron-css/integration': 'integration',
  '@macaron-css/esbuild': 'esbuild',
  '@macaron-css/babel': 'babel',
  '@macaron-css/solid': 'solid',
  '@macaron-css/react': 'react',
  '@macaron-css/vite': 'vite',
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
    !macaronPackageNames.includes(packageName) ||
    !isValidLevel(level)
  ) {
    console.error(`Incorrect package: ${packageName}`);
    return;
  }

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
