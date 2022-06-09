import { NodePath, PluginObj, types as t } from '@babel/core';
import { transformCallExpression } from './transforms/callExpression';
import postprocess from './transforms/postprocess';
import preprocess from './transforms/preprocess';
import { PluginOptions, PluginState } from './types';

export { PluginOptions };

// TODO: target VariableDeclarator instead of VariableDeclaration
export function macaronBabelPlugin(): PluginObj<// opts: PluginOptions
PluginState> {
  let programPath: NodePath<t.Program>;

  return {
    name: 'macaron-css-babel',
    visitor: {
      Program: {
        enter: preprocess,
        exit: postprocess,
      },
      CallExpression: transformCallExpression,
    },
  };
}
