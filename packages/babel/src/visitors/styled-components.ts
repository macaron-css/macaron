import { NodePath, types as t, Visitor } from '@babel/core';
import { Program } from '@babel/types';
import { PluginState } from '../types';
import {
  buildComponent,
  buildComponentStyle,
  buildImport,
  invariant,
} from '../utils';

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
      const styledIdent = programPath.scope.generateUidIdentifier('$$styled');
      const recipeIdent = programPath.scope.generateUidIdentifier('recipe');

      const stmts = [
        buildImport({
          specifier: t.identifier('$$styled'),
          alias: styledIdent,
          source: t.stringLiteral('@comptime-css/solid/runtime'),
        }),
        buildImport({
          specifier: t.identifier('recipe'),
          alias: recipeIdent,
          source: t.stringLiteral('comptime-css'),
        }),
        buildComponentStyle({
          recipeImport: recipeIdent,
          styles: styles.node,
          className,
        }),
      ];

      programPath.unshiftContainer('body', stmts as any);

      const component = buildComponent({
        component: id.node.name,
        styledImport: styledIdent,
        tag: t.cloneNode(tag.node),
        className,
      });

      variablePath.replaceWith(component as any);

      // recompute the references
      // later used in `referencesImports` to check if imported from vanilla-extract
      variablePath.scope.crawl();
    },
  };
}
