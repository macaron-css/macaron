import {
  PluginItem,
  template,
  types as t,
  transformFileAsync,
} from '@babel/core';
import generate from '@babel/generator';

import murmurhash from 'murmurhash';

let buildImport = template('import { %%specifier%% } from %%source%%;');
let buildExport = template('module.exports = %%nodes%%');

function invariant(cond: boolean, message: string): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

export function babelPlugin(opts: { result: [string, string] }): PluginItem {
  return {
    name: 'extract',
    visitor: {
      Program: {
        enter(path, state) {
          state.dependentNodes = new Set<any>();
          state.styledNodes = [];

          path.traverse(
            {
              VariableDeclaration(variablePath, variableState) {
                const declarations = variablePath.get('declarations');

                invariant(
                  declarations.length === 1,
                  'More or less than one declarations'
                );

                const decl = declarations[0].get('init');
                if (Array.isArray(decl) || !decl.isCallExpression()) return;

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

                if (
                  !cssAPIs.some(api =>
                    decl
                      .get('callee')
                      .referencesImport('@vanilla-extract/css', api)
                  ) &&
                  !recipeAPIs.some(api =>
                    decl
                      .get('callee')
                      .referencesImport('@vanilla-extract/recipes', api)
                  )
                )
                  return;

                invariant(
                  decl.node.arguments.length === 1,
                  'found more than one arg'
                );

                for (const key in decl.scope.bindings) {
                  const binding = decl.scope.bindings[key];
                  if (binding && key) {
                    state.dependentNodes.add(binding.path);
                  }
                }

                const name = variablePath.node.declarations[0].id
                  .name as string;

                if (name) {
                  state.styledNodes.push(name);
                }

                variablePath.remove();
              },
            },
            state
          );
        },
        exit(path, state) {
          let ast = buildExport({
            nodes: t.objectExpression(
              state.styledNodes.map(ident =>
                t.objectProperty(t.identifier(ident), t.identifier(ident))
              )
            ),
          });

          const program = t.program(
            [...state.dependentNodes, ast].map(path => {
              if (!path.parent) return path;
              if (path.parent.type === 'Program') {
                return path.node;
              } else {
                return path.parent;
              }
            })
          );

          let finalCode = generate(program).code;

          let cssFile = `extracted_${murmurhash.v2(finalCode)}.css.ts`;
          for (const name of state.styledNodes) {
            path.unshiftContainer(
              'body',
              buildImport({
                specifier: t.identifier(name),
                source: t.stringLiteral(cssFile),
              })
            );
          }

          opts.result = [cssFile, finalCode];
        },
      },
    },
  };
}

export async function runBabel(path: string) {
  let opts = { result: [null, null] as [string, string] };
  let { code } = await transformFileAsync(path, {
    plugins: [babelPlugin(opts)],
  });

  return { result: opts.result, code };
}
