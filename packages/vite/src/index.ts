import {
  addFileScope,
  compile as vCompile,
  cssFileFilter,
  processVanillaFile,
} from '@vanilla-extract/integration';
import { babelTransform, compile } from 'comptime-css-integration';
import outdent from 'outdent';
import { join } from 'path';
import { normalizePath, Plugin, ResolvedConfig, ViteDevServer } from 'vite';

const extractedCssFileFilter = /extracted_(.*)\.css\.ts(\?used)?$/;
const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

export function comptimeCssVitePlugin(): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  const cssMap = new Map<string, string>();

  let virtualExt: string;
  let packageName: string;

  let resolverCache = new Map<string, string>();
  let resolvers = new Map<string, string>();
  let idToPluginData = new Map<string, Record<string, string>>();

  return {
    name: 'comptime-css-vite',
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
      if (extractedCssFileFilter.test(id)) {
        const normalizedId = id.startsWith('/') ? id.slice(1) : id;
        let resolvedPath = normalizePath(join(importer!, '..', normalizedId));

        if (!resolvers.has(resolvedPath)) {
          // console.log('NO RESOLVER');
          return;
        }

        return resolvedPath;
      }

      if (id.endsWith(virtualExt)) {
        const normalizedId = id.startsWith('/') ? id.slice(1) : id;

        if (cssMap.has(normalizedId)) {
          return normalizePath(join(config.root, normalizedId));
        }
      }
    },
    async load(id, options) {
      // console.log('LOADING', id);

      if (extractedCssFileFilter.test(id)) {
        let normalizedId = id.startsWith('/') ? id.slice(1) : id;
        let pluginData = idToPluginData.get(normalizedId);

        // console.log('LOADING', id, p);

        if (!pluginData) {
          // console.log('NO LOAD', {
          //   normalizedId,
          //   id,
          //   idToPluginData,
          // });
          return null;
        }

        const resolverContents = resolvers.get(pluginData.path);

        if (!resolverContents) {
          // console.log('NO RESOLVERS', {
          //   resolvers,
          //   p,
          // });
          return null;
        }

        // console.log(`\n\nRESOLVER CONTENTS (${normalizedId}) ----\n`);
        // console.log(resolverContents);
        // console.log('\n----\n\n');

        idToPluginData.set(id, {
          filePath: normalizedId,
          originalPath: pluginData.mainFilePath,
        });

        return resolverContents;
      }

      if (id.endsWith(virtualExt)) {
        const cssFileId = id.slice(config.root.length + 1);
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
      const moduleInfo = idToPluginData.get(id);

      // console.log('TRANSFORMING', id);

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

        if (ssr) {
          return addFileScope({
            source: code,
            filePath: normalizePath(validId),
            rootPath: config.root,
            packageName,
          });
        }

        // console.log({ code, moduleInfo });

        const { source, watchFiles } = await compile({
          filePath: moduleInfo.filePath,
          cwd: config.root,
          originalPath: moduleInfo.originalPath,
          contents: code,
          resolverCache,
          externals: [],
        });

        // console.log('\n\nSOURCE ----\n');
        // console.log(source);
        // console.log('\n----\n\n');

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

        return replaceCreateRuntimeFnWithComptime(
          await processVanillaFile({
            source,
            filePath: moduleInfo.filePath,
            identOption:
              undefined ?? (config.mode === 'production' ? 'short' : 'debug'),
            serializeVirtualCssPath: async ({ fileScope, source }) => {
              const id = `${fileScope.filePath}${virtualExt}`;

              let cssSource = source;

              if (server && cssMap.has(id) && cssMap.get(id) !== source) {
                const { moduleGraph } = server;
                const moduleId = normalizePath(join(config.root, id));
                const module = moduleGraph.getModuleById(moduleId);

                if (module) {
                  moduleGraph.invalidateModule(module);
                }

                server.ws.send({
                  type: 'custom',
                  event: styleUpdateEvent(id),
                  data: cssSource,
                });
              }

              cssMap.set(id, cssSource);

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

        return replaceCreateRuntimeFnWithComptime(
          await processVanillaFile({
            source,
            filePath: validId,
            identOption:
              undefined ?? (config.mode === 'production' ? 'short' : 'debug'),
            serializeVirtualCssPath: async ({ fileScope, source }) => {
              const id = `${fileScope.filePath}${virtualExt}`;

              let cssSource = source;

              if (server && cssMap.has(id) && cssMap.get(id) !== source) {
                const { moduleGraph } = server;
                const moduleId = normalizePath(join(config.root, id));
                const module = moduleGraph.getModuleById(moduleId);

                if (module) {
                  moduleGraph.invalidateModule(module);
                }

                server.ws.send({
                  type: 'custom',
                  event: styleUpdateEvent(id),
                  data: cssSource,
                });
              }

              cssMap.set(id, cssSource);

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

        if (!file || !cssExtract || !code) return null;
        // the extracted code and original are the same -> no css extracted
        if (cssExtract == code) return null;

        console.log('transforming', id);

        if (config.command === 'build') {
          // console.log('WATCHING', id);
          this.addWatchFile(id);
        }

        let resolvedCssPath = normalizePath(join(id, '..', file));

        console.log(resolvers.get(resolvedCssPath));
        console.log(cssExtract);
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

        // console.log('\n\nCSS EXTRACT ----\n');
        // console.log(cssExtract);
        // console.log('\n----\n\n');

        resolvers.set(resolvedCssPath, cssExtract);
        resolverCache.delete(id);

        idToPluginData.set(id, { mainFilePath: id });
        idToPluginData.set(resolvedCssPath, {
          mainFilePath: id,
          path: resolvedCssPath,
        });

        return {
          code,
          meta: { mainFilePath: id, currentExtractedId: file },
        };
      }

      return null;
    },
  };
}

function replaceCreateRuntimeFnWithComptime(source: string) {
  return source.replace(
    /("@vanilla-extract\/recipes\/createRuntimeFn"|'@vanilla-extract\/recipes\/createRuntimeFn')/g,
    '"comptime-css/create-runtime-fn"'
  );
}
