import {
  addFileScope,
  compile as vCompile,
  cssFileFilter,
  processVanillaFile,
} from '@vanilla-extract/integration';
import { babelTransform, compile } from '@macaron-css/integration';
import outdent from 'outdent';
import { join, resolve } from 'path';
import { normalizePath, Plugin, ResolvedConfig, ViteDevServer } from 'vite';

const extractedCssFileFilter = /extracted_(.*)\.css\.ts(\?used)?$/;
const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

export function macaronVitePlugin(): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  const cssMap = new Map<string, string>();

  let virtualExt: string;
  let packageName: string;

  let resolverCache = new Map<string, string>();
  let resolvers = new Map<string, string>();
  let idToPluginData = new Map<string, Record<string, string>>();

  return {
    name: 'macaron-css-vite',
    enforce: 'pre',
    buildStart() {
      resolvers.clear();
      idToPluginData.clear();
      resolverCache.clear();
    },
    configureServer(_server) {
      server = _server;
    },
    async configResolved(resolvedConfig) {
      config = resolvedConfig;

      virtualExt = `.vanilla.${config.command === 'serve' ? 'js' : 'css'}`;
    },
    resolveId(id, importer, options) {
      if (id.startsWith('\0')) return;

      if (extractedCssFileFilter.test(id)) {
        const normalizedId = id.startsWith('/') ? id.slice(1) : id;
        let resolvedPath = normalizePath(join(importer!, '..', normalizedId));

        if (!resolvers.has(resolvedPath)) {
          return;
        }

        return resolvedPath;
      }

      if (id.endsWith(virtualExt)) {
        const normalizedId = id.startsWith('/') ? id.slice(1) : id;

        const key = normalizePath(resolve(config.root, normalizedId));
        if (cssMap.has(key)) {
          return key;
        }
      }
    },
    async load(id, options) {
      if (id.startsWith('\0')) return;

      if (extractedCssFileFilter.test(id)) {
        let normalizedId = customNormalize(id);
        let pluginData = idToPluginData.get(normalizedId);

        if (!pluginData) {
          return null;
        }

        const resolverContents = resolvers.get(pluginData.path);

        if (!resolverContents) {
          return null;
        }

        idToPluginData.set(id, {
          filePath: id,
          originalPath: pluginData.mainFilePath,
        });

        return resolverContents;
      }

      if (id.endsWith(virtualExt)) {
        // const cssFileId = id.slice(config.root.length + 1);
        const cssFileId = normalizePath(resolve(config.root, id));
        const css = cssMap.get(cssFileId);

        if (typeof css !== 'string') {
          return;
        }

        if (!server) {
          return css;
        }

        return outdent`
        import { injectStyles } from '@vanilla-extract/css/injectStyles';
        
        const inject = (css) => injectStyles({
          fileScope: ${JSON.stringify({ filePath: cssFileId })},
          css
        });
        inject(${JSON.stringify(css)});
        import.meta.hot.on('${styleUpdateEvent(cssFileId)}', (css) => {
          inject(css);
        });   
        `;
      }
    },
    async transform(code, id, ssrParam) {
      if (id.startsWith('\0')) return;

      const moduleInfo = idToPluginData.get(id);

      // is returned from extracted_HASH.css.ts
      if (
        moduleInfo &&
        moduleInfo.originalPath &&
        moduleInfo.filePath &&
        extractedCssFileFilter.test(id)
      ) {
        let ssr: boolean | undefined;

        if (typeof ssrParam === 'boolean') {
          ssr = ssrParam;
        } else {
          ssr = ssrParam?.ssr;
        }

        const index = id.indexOf('?');
        const validId = index === -1 ? id : id.substring(0, index);

        // if (ssr) {
        //   return addFileScope({
        //     source: code,
        //     filePath: normalizePath(validId),
        //     rootPath: config.root,
        //     packageName,
        //   });
        // }

        const { source, watchFiles } = await compile({
          filePath: moduleInfo.filePath,
          cwd: config.root,
          originalPath: moduleInfo.originalPath,
          contents: code,
          resolverCache,
          externals: [],
        });

        for (const file of watchFiles) {
          if (extractedCssFileFilter.test(file)) {
            continue;
          }
          // In start mode, we need to prevent the file from rewatching itself.
          // If it's a `build --watch`, it needs to watch everything.
          if (config.command === 'build' || file !== id) {
            this.addWatchFile(file);
          }
        }

        return replaceCreateRuntimeFnWithMacaron(
          await processVanillaFile({
            source,
            filePath: moduleInfo.filePath,
            identOption:
              undefined ?? (config.mode === 'production' ? 'short' : 'debug'),
            serializeVirtualCssPath: async ({ fileScope, source }) => {
              const id = `${fileScope.filePath}${virtualExt}`;
              const cssFileId = normalizePath(resolve(config.root, id));

              let cssSource = source;

              if (
                server &&
                cssMap.has(cssFileId) &&
                cssMap.get(cssFileId) !== source
              ) {
                const { moduleGraph } = server;
                const moduleId = normalizePath(join(config.root, id));
                const module = moduleGraph.getModuleById(moduleId);

                if (module) {
                  console.log('[1] about to invalidate');
                  moduleGraph.invalidateModule(module);
                }

                server.ws.send({
                  type: 'custom',
                  event: styleUpdateEvent(id),
                  data: cssSource,
                });
              }

              cssMap.set(cssFileId, cssSource);

              return `import "${id}";`;
            },
          })
        );
      }

      if (cssFileFilter.test(id)) {
        let ssr: boolean | undefined;

        if (typeof ssrParam === 'boolean') {
          ssr = ssrParam;
        } else {
          ssr = ssrParam?.ssr;
        }

        const index = id.indexOf('?');
        const validId = index === -1 ? id : id.substring(0, index);

        if (ssr) {
          return addFileScope({
            source: code,
            filePath: normalizePath(validId),
            rootPath: config.root,
            packageName,
          });
        }

        const { source, watchFiles } = await vCompile({
          filePath: validId,
          cwd: config.root,
        });

        for (const file of watchFiles) {
          // In start mode, we need to prevent the file from rewatching itself.
          // If it's a `build --watch`, it needs to watch everything.
          if (config.command === 'build' || file !== id) {
            this.addWatchFile(file);
          }
        }

        return replaceCreateRuntimeFnWithMacaron(
          await processVanillaFile({
            source,
            filePath: validId,
            identOption:
              undefined ?? (config.mode === 'production' ? 'short' : 'debug'),
            serializeVirtualCssPath: async ({ fileScope, source }) => {
              const id = `${fileScope.filePath}${virtualExt}`;
              const cssFileId = normalizePath(resolve(config.root, id));

              let cssSource = source;

              if (
                server &&
                cssMap.has(cssFileId) &&
                cssMap.get(cssFileId) !== source
              ) {
                const { moduleGraph } = server;
                const moduleId = normalizePath(join(config.root, id));
                const module = moduleGraph.getModuleById(moduleId);

                if (module) {
                  console.log('[2] about to invalidate');
                  moduleGraph.invalidateModule(module);
                }

                server.ws.send({
                  type: 'custom',
                  event: styleUpdateEvent(id),
                  data: cssSource,
                });
              }

              cssMap.set(cssFileId, cssSource);

              return `import "${id}";`;
            },
          })
        );
      }

      if (/(j|t)sx?(\?used)?$/.test(id) && !id.endsWith('.vanilla.js')) {
        if (id.includes('node_modules')) return;

        // gets handled by @vanilla-extract/vite-plugin
        if (id.endsWith('.css.ts')) return;

        const {
          code,
          result: [file, cssExtract],
        } = await babelTransform(id);

        // the extracted code and original are the same -> no css extracted
        if (file && cssExtract && cssExtract !== code) {
          if (config.command === 'build') {
            this.addWatchFile(id);
          }

          let resolvedCssPath = normalizePath(join(id, '..', file));

          if (
            server &&
            resolvers.has(resolvedCssPath) &&
            resolvers.get(resolvedCssPath) !== cssExtract
          ) {
            const { moduleGraph } = server;

            const module = moduleGraph.getModuleById(resolvedCssPath);
            if (module) {
              moduleGraph.invalidateModule(module);
            }
          }

          resolvers.set(resolvedCssPath, cssExtract);
          resolverCache.delete(id);

          const normalizedCssPath = customNormalize(resolvedCssPath);

          idToPluginData.set(id, { mainFilePath: id });
          idToPluginData.set(normalizedCssPath, {
            mainFilePath: id,
            path: resolvedCssPath,
          });
        }

        return {
          code,
          meta: { mainFilePath: id, currentExtractedId: file },
        };
      }

      return null;
    },
  };
}

function replaceCreateRuntimeFnWithMacaron(source: string) {
  return source.replace(
    /("@vanilla-extract\/recipes\/createRuntimeFn"|'@vanilla-extract\/recipes\/createRuntimeFn')/g,
    '"@macaron-css/core/create-runtime-fn"'
  );
}

function customNormalize(path: string) {
  return path.startsWith('/') ? path.slice(1) : path;
}
