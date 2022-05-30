import { template, transformFileAsync } from '@babel/core';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import {
  addFileScope,
  getPackageInfo,
  processVanillaFile,
} from '@vanilla-extract/integration';
import esbuild from 'esbuild';
import path from 'path';
import regexgen from 'regexgen';
import { babelPlugin, runBabel } from './utils/babel';
import fs from 'fs';

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  absWorkingDir: process.cwd(),
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  plugins: [
    {
      name: 'custom-extract-plugin',
      setup(build) {
        let resolvers = new Map<string, string>();

        function set(key: string, value: string) {
          resolvers.set(key, value);
        }

        build.onResolve({ filter: /^extracted_(.*)\.css\.ts$/ }, async args => {
          if (!resolvers.has(args.path)) return;

          let p = path.join(args.importer, '..', args.path);

          return {
            namespace: 'extracted-css',
            path: p,
            pluginData: {
              path: args.path,
            },
          };
        });

        build.onLoad(
          { filter: /.*/, namespace: 'extracted-css' },
          async ({ path: p, pluginData }) => {
            const { source, watchFiles } = await compile({
              filePath: p,
              contents: resolvers.get(pluginData.path),
              externals: [],
              cwd: build.initialOptions.absWorkingDir,
            });

            console.log({ p });
            const contents = await processVanillaFile({
              source,
              filePath: p,
              outputCss: undefined,
              identOption:
                undefined ?? (build.initialOptions.minify ? 'short' : 'debug'),
            });

            return {
              contents,
              loader: 'js',
              // watchFiles,
              resolveDir: path.dirname(p),
            };
          }
        );

        build.onLoad({ filter: /\.(j|t)sx?$/ }, async args => {
          if (args.path.includes('node_modules')) return;

          console.log('RESOLVING', args.path);
          // if (args.path.endsWith('.css.ts') || args.path.endsWith('.css.js'))
          //   return;

          const {
            code,
            result: [file, cssExtract],
          } = await runBabel(args.path);

          if (!file || !cssExtract) return;

          console.log(
            resolvers.forEach((v, k) => {
              if (v === cssExtract) {
                console.log('SAME ---', args.path, '-', k);
              }
            })
          );
          set(file, cssExtract);

          console.log('\nCODE --\n', code);

          return {
            contents: code,
            loader: 'ts',
          };
        });
      },
    },
    vanillaExtractPlugin(),
  ],
});

interface CompileOptions {
  filePath: string;
  contents: string;
  cwd?: string;
  externals?: Array<string>;
}

async function compile({
  filePath,
  cwd = process.cwd(),
  externals = [],
  contents,
}: CompileOptions) {
  const result = await esbuild.build({
    stdin: {
      contents: `module.exports = require(${JSON.stringify(filePath)})`,
      loader: 'ts',
      resolveDir: path.dirname(filePath),
      sourcefile: 'entry.css.ts',
    },
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', ...externals],
    platform: 'node',
    write: false,
    plugins: [
      {
        name: 'custom-extract-scope',
        setup(build) {
          let cache = new Set<string>();

          const packageInfo = getPackageInfo(
            build.initialOptions.absWorkingDir
          );
          build.onResolve({ filter: regexgen([filePath]) }, args => {
            return {
              namespace: 's-extracted-css',
              path: args.path,
            };
          });
          build.onResolve(
            { filter: /.*/, namespace: 's-extracted-css' },
            async args => {
              const resolvedPath = await build.resolve(args.path, {
                importer: args.importer,
                resolveDir: args.resolveDir,
              });
              if (resolvedPath.external) {
                return;
              }
              // let contents = await fs.promises.readFile(resolvedPath.path);

              if (cache.has(resolvedPath.path)) {
                return {
                  namespace: 's-extracted-css',
                  path: args.path,
                };
              }

              const {
                code,
                result: [file, content],
              } = await runBabel(resolvedPath.path);

              if (code === content) {
                return { path: resolvedPath.path };
              }

              cache.add(resolvedPath.path);

              return {
                namespace: 's-extracted-css',
                path: resolvedPath.path,
              };
            }
          );

          build.onLoad({ namespace: 's-extracted-css', filter: /.*/ }, args => {
            if (args.path === './theme') {
              args.path = String.raw`C:\Users\admin\Desktop\vanilla-comptime\src\theme.ts`;
            }
            console.log('ADDING FILE SCOPE', args.path);
            const source = addFileScope({
              source: contents,
              filePath: args.path,
              rootPath: build.initialOptions.absWorkingDir!,
              packageName: packageInfo.name,
            });
            // console.log('----');
            // console.log(source);
            return {
              contents: source,
              loader: args.path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
              resolveDir: path.dirname(filePath),
            };
          });
        },
      },
    ],
    absWorkingDir: cwd,
  });

  const { outputFiles, metafile } = result;

  if (!outputFiles || outputFiles.length !== 1) {
    throw new Error('Invalid child compilation');
  }

  return {
    source: outputFiles[0].text,
    watchFiles: Object.keys(metafile?.inputs || {}).map(filePath =>
      path.join(cwd, filePath)
    ),
  };
}
