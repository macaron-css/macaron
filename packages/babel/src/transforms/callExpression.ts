import { type NodePath, types as t } from '@babel/core';
import type { PluginState, ProgramScope } from '../types';
import {
  extractionAPIs,
  getNearestIdentifier,
  registerImportMethod,
} from '../utils';
import * as generator from '@babel/generator';

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

  if (
    callPath.node.leadingComments?.some(
      comment => comment.value.trim() === 'macaron-ignore'
    ) ||
    callPath.parent?.leadingComments?.some(
      comment => comment.value.trim() === 'macaron-ignore'
    )
  ) {
    const bindings = getBindings(callPath);
    for (const binding of bindings) {
      programParent.macaronData.nodes.push(findRootBinding(binding).node);
    }

    return;
  }

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
    programParent.macaronData.nodes.push(findRootBinding(binding).node);
  }

  programParent.macaronData.nodes.push(
    t.exportNamedDeclaration(
      t.variableDeclaration('var', [t.variableDeclarator(ident, callPath.node)])
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

      const rootBinding = findRootBinding(binding.path);

      // prevents infinite loop in a few cases like having arguments in a function declaration
      // if the path being checked is the same as the latest path, then the bindings will be same
      if (path === rootBinding) {
        bindings.push(binding.path);
        return;
      }

      const bindingOfBindings = getBindings(rootBinding);

      bindings.push(...bindingOfBindings, binding.path);
    },
  });

  programParent.macaronData.bindings.push(...bindings);

  return bindings;
}
