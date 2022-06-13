import { types as t, Visitor } from '@babel/core';
import { PluginState } from '../types';
import { invariant, registerImportMethod } from '../utils';

// TODO: move from styled-components visitor to vanilla-extract plugin
// this would make this easier and less prone to errors
export const StyledComponentsVisitor: Visitor<PluginState> = {
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

    invariant(
      callPath.node.arguments.length === 2,
      'Wrong arguments to `styled`'
    );

    const [tag, styles] = callPath.node.arguments;
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

    const callExpression = t.callExpression(styledIdent, [
      t.cloneNode(tag),
      t.callExpression(recipeIdent, [t.cloneNode(styles)]),
    ]);
    t.addComment(callExpression, 'leading', ' @__PURE__ ');

    callPath.replaceWith(callExpression);

    // recompute the references
    // later used in `referencesImports` to check if imported from vanilla-extract
    callPath.scope.crawl();
  },
};
