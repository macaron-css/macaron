// import { NodePath, Node } from '@babel/core';

declare module '@babel/helper-module-imports' {
  export function addNamed(
    path: import('@babel/core').NodePath<import('@babel/core').Node>,
    named: string,
    source: string,
    opts?: { nameHint: string }
  ): import('@babel/types').Identifier;
}
