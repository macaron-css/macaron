import { MacaronNode, PluginState, ProgramScope } from '../types';
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
  const callee = callPath.get('callee');
  if (
    !extractionAPIs.some(api =>
      callee.referencesImport('@macaron-css/core', api)
    )
  ) {
    return;
  }

  const programParent = callPath.scope.getProgramParent() as ProgramScope;
  const nearestIdentifier = getNearestIdentifier(callPath);
  const ident = nearestIdentifier
    ? programParent.generateUidIdentifier(
        `$$macaron_${nearestIdentifier.node.name}`
      )
    : programParent.generateUidIdentifier('$$macaron_identifier');
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

  callPath.traverse({
    Expression(expressionPath, state) {
      if (!expressionPath.isIdentifier()) return;

      const binding = callPath.scope.getBinding(expressionPath as any);
      if (!binding || programParent.macaronData.bindings.includes(binding.path))
        return;

      programParent.macaronData.bindings.push(binding.path);
      programParent.macaronData.nodes.push({
        type: 'binding',
        node: t.cloneNode(findRootBinding(binding.path)),
      });
    },
  });

  programParent.macaronData.nodes.push({
    type: 'style',
    export: declaration,
    shouldReExport: false,
  });

  callPath.replaceWith(importedIdent);
}

function findRootBinding(path: NodePath<t.Node>) {
  let node: t.Node;
  if (!('parent' in path) || path.parentPath?.isProgram()) {
    node = path.node as any;
  } else {
    node = path.parent as any;
  }

  return t.cloneNode(node);
}
