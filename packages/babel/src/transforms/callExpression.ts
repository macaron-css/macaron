import { NodePath, types as t } from '@babel/core';
import { PluginState, ProgramScope } from '../types';
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
        `$macaron$$${nearestIdentifier.node.name}`
      )
    : programParent.generateUidIdentifier('$macaron$$unknown');
  const importedIdent = registerImportMethod(
    callPath,
    ident.name,
    programParent.macaronData.cssFile
  );

  const bindings = getBindings(callPath);
  for (const binding of bindings) {
    programParent.macaronData.nodes.push(
      t.cloneNode(findRootBinding(binding).node)
    );
  }

  programParent.macaronData.nodes.push(
    t.exportNamedDeclaration(
      t.variableDeclaration('var', [
        t.variableDeclarator(ident, t.cloneNode(callPath.node)),
      ])
    )
  );
  // add a variable alias
  // because other transforms use the imported ident as reference
  programParent.macaronData.nodes.push(
    t.variableDeclaration('var', [t.variableDeclarator(importedIdent, ident)])
  );

  callPath.replaceWith(importedIdent);
}

function findRootBinding(path: NodePath<t.Node>) {
  let rootPath: NodePath<t.Node>;
  if (!('parent' in path) || path.parentPath?.isProgram()) {
    rootPath = path;
  } else {
    rootPath = path.parentPath!;
  }

  return rootPath;
}

function getBindings(path: NodePath<t.Node>) {
  const programParent = path.scope.getProgramParent() as ProgramScope;
  const bindings: Array<NodePath<t.Node>> = [];

  path.traverse({
    Expression(expressionPath, state) {
      if (!expressionPath.isIdentifier()) return;

      const binding = path.scope.getBinding(expressionPath as any);
      if (
        !binding ||
        programParent.macaronData.bindings.includes(binding.path) ||
        bindings.includes(binding.path)
      )
        return;

      const bindingOfBindings = getBindings(findRootBinding(binding.path));

      bindings.push(...bindingOfBindings, binding.path);
    },
  });

  programParent.macaronData.bindings.push(...bindings);

  return bindings;
}
