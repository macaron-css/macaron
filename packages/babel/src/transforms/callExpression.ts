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
  if (
    !extractionAPIs.some(api =>
      callPath.get('callee').referencesImport('@macaron-css/core', api)
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

  const allBindings = callPath.scope.getAllBindings() as Record<
    string,
    Binding
  >;

  let shouldPush = false;
  let alreadyPushed = false;
  const pushStyle = () => {
    if (shouldPush && !alreadyPushed) {
      programParent.macaronData.nodes.push({
        type: 'style',
        export: declaration,
        shouldReExport: false,
      });

      alreadyPushed = true;
    }

    shouldPush = true;
  };

  for (const bindingName in allBindings) {
    const binding = allBindings[bindingName];
    if (binding && bindingName) {
      const bindingNode = findRootBinding(binding.path);
      const bindingLoc = bindingNode.loc;
      const callLoc = callPath.node.loc;

      const pushBinding = () => {
        if (programParent.macaronData.bindings.includes(binding.path)) {
          return;
        }

        programParent.macaronData.nodes.push({
          type: 'binding',
          node: t.cloneNode(bindingNode),
        });
        programParent.macaronData.bindings.push(binding.path);
      };

      if (programParent.macaronData.bindings.includes(binding.path)) {
        pushStyle();

        continue;
      }

      if (bindingLoc == null || callLoc == null) {
        pushBinding();
        pushStyle();

        continue;
      }

      if (
        bindingLoc.end.line < callLoc.start.line ||
        (bindingLoc.start.line < callLoc.start.line &&
          bindingLoc.end.line > callLoc.end.line) ||
        (bindingLoc.start.line === callLoc.start.line &&
          bindingLoc.start.column < callLoc.start.column)
      ) {
        shouldPush = false;
        pushBinding();
        pushStyle();
      } else {
        pushStyle();
        pushBinding();
      }
    }
  }

  pushStyle();

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
