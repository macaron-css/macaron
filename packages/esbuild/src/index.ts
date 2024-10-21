import { processVanillaFile } from '@vanilla-extract/integration';
import { Plugin as EsbuildPlugin } from 'esbuild';
import { dirname, join } from 'path';
import { babelTransform, compile } from '@macaron-css/integration';

/*
  -> load /(t|j)sx?/
  -> extract css and inject imports (extracted_HASH.css.ts)
    -> resolve all imports
    -> load imports, bundle code again
      -> add file scope to all files
      -> evaluate and generate .vanilla.css.ts files
      -> gets resolved by @vanilla-extract/esbuild-plugin
    -> process the file with vanilla-extract
    -> resolve with js loader
*/

interface MacaronEsbuildPluginOptions {
  includeNodeModulesPattern?: RegExp;
}

export function macaronEsbuildPlugin({
  includeNodeModulesPattern,
}: MacaronEsbuildPluginOptions = {}): EsbuildPlugin {
  return {
    name: 'macaron-css-esbuild',
    setup(build) {
      let resolvers = new Map<string, string>();
      let resolverCache = new Map<string, string>();

      build.onEnd(() => {
        resolvers.clear();
        resolverCache.clear();
      });

      build.onResolve({ filter: /^extracted_(.*)\.css\.ts$/ }, async args => {
        if (!resolvers.has(args.path)) {
          return;
        }

        let resolvedPath = join(args.importer, '..', args.path);

        return {
          namespace: 'extracted-css',
          path: resolvedPath,
          pluginData: {
            path: args.path,
            mainFilePath: args.pluginData.mainFilePath,
          },
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: 'extracted-css' },
        async ({ path, pluginData }) => {
          const resolverContents = resolvers.get(pluginData.path)!;
          const { source, watchFiles } = await compile({
            esbuild: build.esbuild,
            filePath: path,
            originalPath: pluginData.mainFilePath!,
            contents: resolverContents,
            externals: [],
            cwd: build.initialOptions.absWorkingDir,
            resolverCache,
          });

          try {
            const contents = await processVanillaFile({
              source,
              filePath: path,
              outputCss: undefined,
              identOption:
                undefined ?? (build.initialOptions.minify ? 'short' : 'debug'),
            });

            return {
              contents,
              loader: 'js',
              resolveDir: dirname(path),
            };
          } catch (error) {
            if (error instanceof ReferenceError) {
              return {
                errors: [
                  {
                    text: error.toString(),
                    detail:
                      'This usually happens if you use a browser api at the top level of a file being imported.',
                  },
                ],
              };
            }

            throw error;
          }
        }
      );

      build.onLoad({ filter: /\.(j|t)sx?$/ }, async args => {
        if (args.path.includes('node_modules')) {
          if(!includeNodeModulesPattern) return;
          if(!includeNodeModulesPattern.test(args.path)) return;
        };

        // gets handled by @vanilla-extract/esbuild-plugin
        if (args.path.endsWith('.css.ts')) return;

        const {
          code,
          result: [file, cssExtract],
        } = await babelTransform(args.path);

        // the extracted code and original are the same -> no css extracted
        if (file && cssExtract && cssExtract !== code) {
          resolvers.set(file, cssExtract);
          resolverCache.delete(args.path);
        }

        return {
          contents: code!,
          loader: args.path.match(/\.(ts|tsx)$/i) ? 'ts' : 'js',
          pluginData: {
            mainFilePath: args.path,
          },
        };
      });
    },
  };
}

export const macaronEsbuildPlugins = () => [
  macaronEsbuildPlugin(),
  require('@vanilla-extract/esbuild-plugin').vanillaExtractPlugin(),
];
