import { PluginState, ProgramScope } from '../types';
import { NodePath, types as t } from '@babel/core';
import { Binding } from '@babel/traverse';
import {
  extractionAPIs,
  getNearestIdentifier,
  registerImportMethod,
} from '../utils';

export function transformCallExpression(
  callPath: NodePath<t.CallExpression>,
  _callState: PluginState
) {
  if (
    !extractionAPIs.some(api =>
      callPath.get('callee').referencesImport('@macaron-css/core', api)
    )
  ) {
    return;
  }

  const programParent = callPath.scope.getProgramParent() as ProgramScope;

  if (callPath.parentPath.isVariableDeclarator()) {
    const variablePath = callPath.parentPath;
    const shouldReExport =
      variablePath.parentPath.parentPath?.isExportNamedDeclaration() ?? false;
    const ident = variablePath.get('id') as NodePath<t.Node>;

    if (!ident.isArrayPattern() && !ident.isIdentifier()) {
      throw new Error(
        'Declaration should be an `ArrayPattern` or `Identifier`'
      );
    }

    const allBindings = variablePath.scope.getAllBindings() as Record<
      string,
      Binding
    >;

    for (const bindingName in allBindings) {
      const binding = allBindings[bindingName];
      // binding.
    }

    if (ident.isArrayPattern()) {
      for (const elementPath of ident.get('elements')) {
        if (elementPath.isIdentifier()) {
          const programUniqueIdent = programParent.generateUidIdentifier(
            elementPath.node.name
          );

          const importedIdent = registerImportMethod(
            variablePath,
            programUniqueIdent.name,
            programParent.macaronData.cssFile
          );

          variablePath.scope.rename(
            elementPath.node.name,
            programUniqueIdent.name
          );

          // this happening on each array pattern element means
          // that multiple declarations get written to in the virtual file
          // but it shouldn't matter much since they get tree shaked by the bundler
          // and new identifiers are created for each, so it shouldn't cause violations
          programParent.macaronData.styles.push({
            shouldReExport,
            declaration: t.exportNamedDeclaration(
              t.variableDeclaration('var', [t.cloneNode(variablePath.node)])
            ),
            name: programUniqueIdent.name,
          });

          variablePath.scope.rename(
            programUniqueIdent.name,
            importedIdent.name
          );
        }
      }
    } else {
      const programUniqueIdent = programParent.generateUidIdentifier(
        ident.node.name
      );

      variablePath.scope.rename(ident.node.name, programUniqueIdent.name);

      const importedIdent = registerImportMethod(
        variablePath,
        programUniqueIdent.name,
        programParent.macaronData.cssFile
      );

      programParent.macaronData.styles.push({
        shouldReExport,
        declaration: t.exportNamedDeclaration(
          t.variableDeclaration('var', [t.cloneNode(variablePath.node)])
        ),
        name: programUniqueIdent.name,
      });

      variablePath.scope.rename(programUniqueIdent.name, importedIdent.name);
    }

    variablePath.remove();

    return;
  }

  const nearestIdentifier = getNearestIdentifier(callPath);
  const ident = nearestIdentifier
    ? programParent.generateUidIdentifier(
        `$$macaron_${nearestIdentifier.node.name}`
      )
    : programParent.generateUidIdentifier('$$unknown_macaron_identifier');
  const importedIdent = registerImportMethod(
    callPath,
    ident.name,
    programParent.macaronData.cssFile
  );

  const declaration = t.exportNamedDeclaration(
    t.variableDeclaration('var', [
      t.variableDeclarator(ident, t.cloneNode(callPath.node)),
    ])
  );

  programParent.macaronData.styles.push({
    shouldReExport: false,
    declaration,
    name: ident.name,
  });
  callPath.replaceWith(importedIdent);
}
