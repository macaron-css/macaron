import { types as t, type PluginObj } from '@babel/core';
import type { PluginState, ProgramScope } from './types';
import { registerImportMethod } from './utils';
import * as generator from '@babel/generator';
export function styledComponentsPlugin(): PluginObj<PluginState> {
  return {
    name: 'macaron-css-babel:styled',
    visitor: {
      Program: {
        enter(path) {
          (path.scope as any).macaronData ??= {};
          path.traverse({
            CallExpression(callPath) {
              const callee = callPath.get('callee');

              const isSolidAdapter = callee.referencesImport(
                '@macaron-css/solid',
                'styled'
              );
              const isReactAdapter = callee.referencesImport(
                '@macaron-css/react',
                'styled'
              );
              if (!isSolidAdapter && !isReactAdapter) return;

              const runtimeImport = isSolidAdapter
                ? '@macaron-css/solid/runtime'
                : '@macaron-css/react/runtime';

              const [tag, styles, ...args] = callPath.node.arguments;
              const styledIdent = registerImportMethod(
                callPath,
                '$$styled',
                runtimeImport
              );
              const recipeIdent = registerImportMethod(
                callPath,
                'recipe',
                '@macaron-css/core'
              );

              const recipeCallExpression = t.callExpression(recipeIdent, [
                t.cloneNode(styles),
              ]);
              t.addComments(
                recipeCallExpression,
                'leading',
                callPath.node.leadingComments ?? []
              );
              const callExpression = t.callExpression(styledIdent, [
                t.cloneNode(tag),
                recipeCallExpression,
                ...args,
              ]);
              t.addComment(callExpression, 'leading', ' @__PURE__ ');

              callPath.replaceWith(callExpression);

              // recompute the references
              // later used in `referencesImports` to check if imported from macaron
              path.scope.crawl();
            },
          });
        },
      },
    },
  };
}
