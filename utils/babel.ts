import {
  PluginItem,
  template,
  types as t,
  transformFileAsync,
  PluginObj,
  NodePath,
} from '@babel/core';
import generate from '@babel/generator';
import murmurhash from 'murmurhash';
import { basename } from 'path';
import path = require('path');

const buildImport = template(
  'import { %%specifier%% as %%alias%% } from %%source%%;'
);
const buildModuleExport = template('module.exports = %%nodes%%');
const buildNamedExport = template('export { %%ident%% }');
// const buildComponentImports = `
// import { recipe as %%recipeImport%% } from '@vanilla-extract/styled';
// import { $$styled as %%styledImport%% } from '@lib/styled';
// `;
const buildComponentStyle = template(`
const %%className%% = %%recipeImport%%(%%styles%%);
`);
const buildComponent = template(
  `const %%component%% = %%styledImport%%(%%tag%%, %%className%%);`
);

function invariant(cond: boolean, message: string): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

export function babelPlugin(opts: {
  result: [string, string];
  path: string;
}): PluginObj<{
  dependentNodes: Set<NodePath<t.Node>>;
  styledNodes: Array<{ shouldExport: boolean; ident: string }>;
}> {
  return {
    name: 'extract',
    visitor: {
      Program: {
        enter(path, state) {
          state.dependentNodes = new Set();
          state.styledNodes = [];

          path.traverse(
            {
              VariableDeclaration(variablePath, variableState) {
                const declarations = variablePath.get('declarations');

                if (declarations.length < 1) return;

                const decl = declarations[0].get('init');
                const id = declarations[0].get('id');

                if (!decl.isCallExpression()) return;
                if (!id.isIdentifier()) return;

                const isImportedFromLib = decl
                  .get('callee')
                  .referencesImport('@lib/styled', 'styled');

                if (!isImportedFromLib) {
                  return;
                }

                invariant(
                  decl.get('arguments').length === 2,
                  'Wrong arguments to `styled`'
                );

                const [tag, styles] = decl.get('arguments');

                const className = variablePath.scope.generateUidIdentifier(
                  id.node.name.toLowerCase()
                );
                const styledIdent =
                  path.scope.generateUidIdentifier('$$styled');
                const recipeIdent = path.scope.generateUidIdentifier('recipe');

                const stmts = [
                  buildImport({
                    specifier: t.identifier('$$styled'),
                    alias: styledIdent,
                    source: t.stringLiteral('@lib/styled'),
                  }),
                  buildImport({
                    specifier: t.identifier('recipe'),
                    alias: recipeIdent,
                    source: t.stringLiteral('@vanilla-extract/recipes'),
                  }),
                  buildComponentStyle({
                    recipeImport: recipeIdent,
                    styles: styles.node,
                    className,
                  }),
                ];

                path.unshiftContainer('body', stmts as any);
                const component = buildComponent({
                  component: id.node.name,
                  styledImport: styledIdent,
                  tag: t.cloneNode(tag.node),
                  className,
                });

                variablePath.replaceWith(component as any);

                variablePath.scope.crawl();
              },
            },
            state
          );
        },
        exit(path, state) {
          let ast = buildModuleExport({
            nodes: t.objectExpression(
              state.styledNodes.map(node =>
                t.objectProperty(
                  t.identifier(node.ident),
                  t.identifier(node.ident)
                )
              )
            ),
          });

          const program = t.program(
            [...(state.dependentNodes as any), ast].map(path => {
              if (!('parent' in path)) return path;
              if (path.parent.type === 'Program') {
                return path.node as any;
              } else {
                return path.parent as any;
              }
            })
          );

          let cssExtract = generate(program).code;

          let cssFile = `extracted_${murmurhash.v2(cssExtract)}.css.ts`;

          // TODO: convert multiple imports/exports to one
          for (const name of state.styledNodes) {
            path.unshiftContainer(
              'body',
              buildImport({
                specifier: t.identifier(name.ident),
                alias: t.identifier(name.ident),
                // source: t.stringLiteral(
                //   `${cssFile}?from=${Buffer.from(opts.path, 'utf8').toString(
                //     'base64'
                //   )}`
                // ),
                source: t.stringLiteral(cssFile),
              })
            );

            if (name.shouldExport) {
              path.pushContainer(
                'body',
                buildNamedExport({ ident: name.ident })
              );
            }
          }

          opts.result = [cssFile, cssExtract];
        },
      },
      VariableDeclaration(variablePath, variableState) {
        const declarations = variablePath.get('declarations');

        if (declarations.length < 1) return;

        const decl = declarations[0].get('init');
        const id = declarations[0].get('id');

        if (!decl.isCallExpression()) return;
        if (!id.isArrayPattern() && !id.isIdentifier()) return;

        const cssAPIs = [
          'style',
          'styleVariants',
          'globalStyle',
          'createTheme',
          'createGlobalTheme',
          'createThemeContract',
          'createGlobalThemeContract',
          'assignVars',
          'createVar',
          'fallbackVar',
          'fontFace',
          'globalFontFace',
          'keyframes',
          'globalKeyframes',
          'style',
          'styleVariants',
          'globalStyle',
          'createTheme',
          'createGlobalTheme',
          'createThemeContract',
          'createGlobalThemeContract',
          'assignVars',
          'createVar',
          'fallbackVar',
          'fontFace',
          'globalFontFace',
          'keyframes',
          'globalKeyframes',
        ];
        const recipeAPIs = ['recipe'];

        let callee = variablePath.get('declarations.0.init.callee') as NodePath<
          t.V8IntrinsicIdentifier | t.Expression
        >;

        if (
          !cssAPIs.some(api =>
            decl.get('callee').referencesImport('@vanilla-extract/css', api)
          ) &&
          !recipeAPIs.some(api =>
            decl.get('callee').referencesImport('@vanilla-extract/recipes', api)
          )
        ) {
          return;
        }

        for (const key in decl.scope.bindings) {
          const binding = decl.scope.bindings[key];
          if (binding && key) {
            variableState.dependentNodes.add(binding.path);
          }
        }

        const shouldExport = variablePath.parentPath.isExportNamedDeclaration();

        if (id.isArrayPattern()) {
          for (const elementPath of id.get('elements')) {
            if (elementPath.isIdentifier()) {
              variableState.styledNodes.push({
                shouldExport,
                ident: elementPath.node.name,
              });
            }
          }
        } else {
          variableState.styledNodes.push({
            shouldExport,
            ident: id.node.name,
          });
        }

        variablePath.remove();
      },
    },
  };
}

export async function runBabel(path: string) {
  const options = { result: [null, null] as [string, string], path };
  const { code } = await transformFileAsync(path, {
    plugins: [babelPlugin(options)],
    presets: ['@babel/preset-typescript'],
  });

  console.log('\n\n\nCODE ----\n', code, '\n\n');

  return { result: options.result, code };
}
