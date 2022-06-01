import { addFileScope, getPackageInfo } from '@vanilla-extract/integration';
import { PluginBuild } from 'esbuild';
import fs from 'fs';
import { basename, dirname, join } from 'path';

interface CompileOptions {
  esbuild: PluginBuild['esbuild'];
  filePath: string;
  contents: string;
  cwd?: string;
  externals?: Array<string>;
  resolverCache: Map<string, string>;
  originalPath: string;
}

export async function compile({
  esbuild,
  filePath,
  cwd = process.cwd(),
  externals = [],
  contents,
  resolverCache,
  originalPath,
}: CompileOptions) {
  const packageInfo = getPackageInfo(cwd);
  let source: string;

  if (resolverCache.has(originalPath)) {
    source = resolverCache.get(originalPath)!;
  } else {
    source = addFileScope({
      source: contents,
      filePath: originalPath,
      rootPath: cwd,
      packageName: packageInfo.name,
    });

    resolverCache.set(originalPath, source);
  }

  const result = await esbuild.build({
    stdin: {
      contents: source,
      // contents: `module.exports = require(${JSON.stringify(filePath)})`,
      loader: 'ts',
      resolveDir: dirname(filePath),
      sourcefile: basename(filePath),
    },
    metafile: true,
    bundle: true,
    external: [
      '@vanilla-extract',
      'solid-js',
      'comptime-css',
      '@comptime-css',
      ...externals,
    ],
    platform: 'node',
    write: false,
    absWorkingDir: cwd,
    plugins: [
      {
        name: 'custom-extract-scope',
        setup(build) {
          build.onLoad({ filter: /\.(t|j)sx?$/ }, async args => {
            let contents = await fs.promises.readFile(args.path, 'utf8');
            let source: string;

            if (resolverCache.has(args.path)) {
              source = resolverCache.get(args.path)!;
            } else {
              source = addFileScope({
                source: contents,
                filePath: args.path,
                rootPath: build.initialOptions.absWorkingDir!,
                packageName: packageInfo.name,
              });

              resolverCache.set(args.path, source);
            }

            return {
              contents: source,
              loader: args.path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
              resolveDir: dirname(args.path),
            };
          });
        },
      },
    ],
  });

  const { outputFiles, metafile } = result;

  if (!outputFiles || outputFiles.length !== 1) {
    throw new Error('Invalid child compilation');
  }

  return {
    source: outputFiles[0].text,
    watchFiles: Object.keys(metafile?.inputs || {}).map(filePath =>
      join(cwd, filePath)
    ),
  };
}
