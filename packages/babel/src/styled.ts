import { types as t, type PluginObj } from '@babel/core';
import type { PluginState } from './types';
import { registerImportMethod } from './utils';

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

              // invariant(
              //   callPath.node.arguments.length === 2,
              //   'Wrong arguments to `styled`'
              // );

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
              const callExpression = t.callExpression(styledIdent, [
                t.cloneNode(tag),
                recipeCallExpression,
                ...args,
              ]);
              t.addComment(callExpression, 'leading', ' @__PURE__ ');
              t.addComments(
                recipeCallExpression,
                'leading',
                callPath.node.leadingComments ?? []
              );

              callPath.replaceWith(callExpression);

              // recompute the references
              // later used in `referencesImports` to check if imported from vanilla-extract
              callPath.scope.crawl();
            },
          });
        },
      },
    },
  };
}
