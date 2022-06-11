import { NodePath, types as t, Visitor } from '@babel/core';
import { Program } from '@babel/types';
import { PluginState } from '../types';
import {
  buildComponent,
  buildComponentStyle,
  buildImport,
  invariant,
} from '../utils';

// TODO: move from styled-components visitor to vanilla-extract plugin
// this would make this easier and less prone to errors
export function styledComponentsVisitor(
  programPath: NodePath<Program>
): Visitor<PluginState> {
  return {
    VariableDeclaration(variablePath) {
      const declarations = variablePath.get('declarations');

      if (declarations.length < 1) return;

      const decl = declarations[0].get('init');
      const id = declarations[0].get('id');

      if (!decl.isCallExpression()) return;
      if (!id.isIdentifier()) return;

      const isSolidAdapter = decl
        .get('callee')
        .referencesImport('@macaron-css/solid', 'styled');
      const isReactAdapter = decl
        .get('callee')
        .referencesImport('@macaron-css/react', 'styled');

      const isImportedFromAdapter = isSolidAdapter || isReactAdapter;
      const runtimeImport = isSolidAdapter
        ? '@macaron-css/solid/runtime'
        : '@macaron-css/react/runtime';

      if (!isImportedFromAdapter) {
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
      const styledIdent = programPath.scope.generateUidIdentifier('$$styled');
      const recipeIdent = programPath.scope.generateUidIdentifier('recipe');

      const stmts = [
        buildImport({
          specifier: t.identifier('$$styled'),
          alias: styledIdent,
          source: t.stringLiteral(runtimeImport),
        }),
        buildImport({
          specifier: t.identifier('recipe'),
          alias: recipeIdent,
          source: t.stringLiteral('@macaron-css/core'),
        }),
        buildComponentStyle({
          recipeImport: recipeIdent,
          styles: styles.node,
          className,
        }),
      ];

      programPath.unshiftContainer('body', stmts as any);

      // const component = buildComponent({
      //   component: id.node.name,
      //   styledImport: styledIdent,
      //   tag: t.cloneNode(tag.node),
      //   className,
      // });
      const callExpression = t.callExpression(styledIdent, [
        t.cloneNode(tag.node),
        className,
      ]);
      t.addComment(callExpression, 'leading', ' @__PURE__ ');

      const component = t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier(id.node.name), callExpression),
      ]);

      variablePath.replaceWith(component);

      // recompute the references
      // later used in `referencesImports` to check if imported from vanilla-extract
      variablePath.scope.crawl();
    },
  };
}
