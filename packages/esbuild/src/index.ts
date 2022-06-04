import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { processVanillaFile } from '@vanilla-extract/integration';
import { Plugin } from 'esbuild';
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
export function macaronEsbuildPlugin(): Plugin {
  return {
    name: 'macaron-css-esbuild',
    setup(build) {
      let resolvers = new Map<string, string>();
      let resolverCache = new Map<string, string>();

      build.onResolve(
        // { filter: /^extracted_(.*)\.css\.ts\?from=(.*)$/ },
        { filter: /^extracted_(.*)\.css\.ts$/ },
        async args => {
          if (!resolvers.has(args.path)) return;

          let resolvedPath = join(args.importer, '..', args.path);

          return {
            namespace: 'extracted-css',
            path: resolvedPath,
            pluginData: {
              path: args.path,
              mainFilePath: args.pluginData.mainFilePath,
            },
          };
        }
      );

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

          const contents = await processVanillaFile({
            source,
            filePath: path,
            outputCss: undefined,
            identOption:
              undefined ?? (build.initialOptions.minify ? 'short' : 'debug'),
          });

          return {
            contents: contents.replace(
              /("@vanilla-extract\/recipes\/createRuntimeFn"|'@vanilla-extract\/recipes\/createRuntimeFn')/g,
              '"@macaron-css/core/create-runtime-fn"'
            ),
            loader: 'js',
            // watchFiles,
            resolveDir: dirname(path),
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
  vanillaExtractPlugin(),
];
