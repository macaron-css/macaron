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
import { runBabel } from './utils/babel';
import fs from 'fs';
import murmurhash from 'murmurhash';

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

        build.onResolve(
          // { filter: /^extracted_(.*)\.css\.ts\?from=(.*)$/ },
          { filter: /^extracted_(.*)\.css\.ts$/ },
          async args => {
            if (!resolvers.has(args.path)) return;

            let p = path.join(args.importer, '..', args.path);

            return {
              namespace: 'extracted-css',
              path: p,
              pluginData: {
                path: args.path,
              },
            };
          }
        );

        build.onLoad(
          { filter: /.*/, namespace: 'extracted-css' },
          async ({ path: p, pluginData }) => {
            const { source, watchFiles } = await compile({
              filePath: p,
              contents: resolvers.get(pluginData.path),
              externals: [],
              cwd: build.initialOptions.absWorkingDir,
              resolverCache: resolvers,
            });

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

          // gets handled by @vanilla-extract/esbuild-plugin
          if (args.path.endsWith('.css.ts')) return;

          const {
            code,
            result: [file, cssExtract],
          } = await runBabel(args.path);

          if (!file || !cssExtract) return;
          // the extracted code and original are the same -> no css extracted
          if (cssExtract == code) return;

          resolvers.set(file, cssExtract);

          return {
            contents: code,
            loader: args.path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
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
  resolverCache: Map<string, string>;
}

async function compile({
  filePath,
  cwd = process.cwd(),
  externals = [],
  contents,
  resolverCache,
}: CompileOptions) {
  const packageInfo = getPackageInfo(cwd);
  const source = addFileScope({
    source: contents,
    filePath: filePath,
    rootPath: cwd,
    packageName: packageInfo.name,
  });

  const result = await esbuild.build({
    stdin: {
      contents: source,
      // contents: `module.exports = require(${JSON.stringify(filePath)})`,
      loader: 'ts',
      resolveDir: path.dirname(filePath),
      sourcefile: path.basename(filePath),
    },
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', 'solid-js', ...externals],
    platform: 'node',
    write: false,
    absWorkingDir: cwd,
    plugins: [
      {
        name: 'custom-extract-scope',
        setup(build) {
          build.onLoad({ filter: /\.(t|j)sx?$/ }, async args => {
            const {
              code,
              result: [file, cssExtract],
            } = await runBabel(args.path);

            if (code === cssExtract) {
              return;
            }

            const source = addFileScope({
              source: await fs.promises.readFile(args.path, 'utf8'),
              filePath: args.path,
              rootPath: build.initialOptions.absWorkingDir!,
              packageName: packageInfo.name,
            });

            return {
              contents: source,
              loader: args.path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
              resolveDir: path.dirname(args.path),
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
      path.join(cwd, filePath)
    ),
  };
}
