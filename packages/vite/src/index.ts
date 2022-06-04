import {
  addFileScope,
  cssFileFilter,
  processVanillaFile,
  compile as vCompile,
} from '@vanilla-extract/integration';
import { join, normalize } from 'path';
import { normalizePath, Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import {} from 'vite';
import { babelTransform } from './babel';
import { compile } from './compile';
import outdent from 'outdent';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const extractedCssFileFilter = /extracted_(.*)\.css\.ts(\?used)?$/;
const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

export function comptimeCssVitePlugin(): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  // let postCssConfig: PostCSSConfigResult | null;
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
        let p = idToPluginData.get(normalizedId);

        // console.log('LOADING', id, p);

        if (!p) {
          // console.log('NO LOAD', {
          //   normalizedId,
          //   id,
          //   idToPluginData,
          // });
          return null;
        }

        const resolverContents = resolvers.get(p.path);

        if (!resolverContents) {
          // console.log('NO RESOLVERS', {
          //   resolvers,
          //   p,
          // });
        }

        // console.log(`\n\nRESOLVER CONTENTS (${normalizedId}) ----\n`);
        // console.log(resolverContents);
        // console.log('\n----\n\n');

        idToPluginData.set(id, {
          filePath: normalizedId,
          originalPath: p.mainFilePath,
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

        let d = outdent`
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

        // console.log('\n\nLOADED ----\n');
        // console.log(d);
        // console.log('\n----\n\n');

        return d;
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

        try {
          let processedFile = await processVanillaFile({
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
          });

          // console.log('\n\nPROCESSED ----\n');
          // console.log(processedFile);
          // console.log('\n----\n\n');

          return processedFile;
        } catch (err) {
          throw new Error('CRASHED');
          // console.error(err);
        }
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

        return processVanillaFile({
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

              // console.log('SENDING');
              server.ws.send({
                type: 'custom',
                event: styleUpdateEvent(id),
                data: cssSource,
              });
            }

            cssMap.set(id, cssSource);

            return `import "${id}";`;
          },
        });
      }

      if (/(j|t)sx?(\?used)?$/.test(id) && !id.endsWith('.vanilla.js')) {
        if (id.includes('node_modules')) return;

        // gets handled by @vanilla-extract/vite-plugin
        if (id.endsWith('.css.ts')) return;

        const prevModule = this.getModuleInfo(id);

        const {
          code,
          result: [file, cssExtract],
        } = await babelTransform(id);

        if (!file || !cssExtract) return null;
        // the extracted code and original are the same -> no css extracted
        if (cssExtract == code) return null;

        if (config.command === 'build') {
          // console.log('WATCHING', id);
          this.addWatchFile(id);
        }

        let resolvedCssPath = normalizePath(join(id, '..', file));

        if (
          server &&
          prevModule?.meta?.currentExtractedId &&
          prevModule?.meta?.currentExtractedId !== file
        ) {
          let prevId = prevModule?.meta?.currentExtractedId;
          // console.log({ prevId, id });
          const { moduleGraph } = server;
          let prevResolvedCssPath = normalizePath(join(id, '..', prevId));
          const modules = [
            ...moduleGraph.fileToModulesMap.get(prevResolvedCssPath)!,
          ];

          if (modules.length === 1) {
            const module = modules[0];
            if (module) {
              moduleGraph.invalidateModule(module);
              // moduleGraph.invalidateModule(id);
            }
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
