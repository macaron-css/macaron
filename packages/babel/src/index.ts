import { PluginObj } from '@babel/core';
import { transformCallExpression } from './transforms/callExpression';
import postprocess from './transforms/postprocess';
import preprocess from './transforms/preprocess';
import { PluginOptions, PluginState } from './types';

export { styledComponentsPlugin as macaronStyledComponentsPlugin } from './styled';
export { PluginOptions };

export function macaronBabelPlugin(): PluginObj<PluginState> {
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
