import { transformSync } from '@babel/core';
import { macaronStyledComponentsPlugin } from '@macaron-css/babel';
import { addFileScope, getPackageInfo } from '@vanilla-extract/integration';
import defaultEsbuild, { PluginBuild } from 'esbuild';
import fs from 'fs';
import { basename, dirname, join } from 'path';

interface CompileOptions {
  esbuild?: PluginBuild['esbuild'];
  filePath: string;
  contents: string;
  cwd?: string;
  externals?: Array<string>;
  resolverCache: Map<string, string>;
  originalPath: string;
}

export async function compile({
  esbuild = defaultEsbuild,
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
      loader: 'tsx',
      resolveDir: dirname(filePath),
      sourcefile: basename(filePath),
    },
    metafile: true,
    bundle: true,
    external: [
      '@vanilla-extract',
      // 'solid-js',
      '@macaron-css',
      // '@comptime-css',
      ...externals,
    ],
    platform: 'node',
    write: false,
    absWorkingDir: cwd,
    plugins: [
      {
        name: 'macaron:stub-solid-template-export',
        setup(build) {
          build.onResolve({ filter: /^solid-js\/web$/ }, args => {
            return {
              namespace: 'solid-web',
              path: args.path,
            };
          });

          // TODO: change this to use the server transform from solid
          build.onLoad({ filter: /.*/, namespace: 'solid-web' }, async args => {
            return {
              contents: `
              const noop = () => {
                return new Proxy({}, {
                  get() {
                    throw new Error("macaron: This file tried to call template() directly and use its result. Please check your compiled solid-js output and if it is correct, please file an issue at https://github.com/mokshit06/macaron/issues");
                  }
                });
              }

              export const template = noop;
              export const delegateEvents = noop;

              export * from ${JSON.stringify(require.resolve('solid-js/web'))};
              `,
              resolveDir: dirname(args.path),
            };
          });
        },
      },
      {
        name: 'macaron:custom-extract-scope',
        setup(build) {
          build.onLoad({ filter: /\.(t|j)sx?$/ }, async args => {
            const contents = await fs.promises.readFile(args.path, 'utf8');
            let source = addFileScope({
              source: contents,
              filePath: args.path,
              rootPath: build.initialOptions.absWorkingDir!,
              packageName: packageInfo.name,
            });

            source = transformSync(source, {
              filename: args.path,
              plugins: [macaronStyledComponentsPlugin()],
              presets: ['@babel/preset-typescript'],
              sourceMaps: false,
            })!.code!;

            return {
              contents: source,
              loader: 'tsx',
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
