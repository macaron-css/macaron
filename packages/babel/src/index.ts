import type { PluginObj } from '@babel/core';
import { transformCallExpression } from './transforms/callExpression';
import postprocess from './transforms/postprocess';
import preprocess from './transforms/preprocess';
import type { PluginOptions, PluginState } from './types';

export { styledComponentsPlugin as macaronStyledComponentsPlugin } from './styled';
export type { PluginOptions };

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
