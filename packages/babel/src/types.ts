import { NodePath, Node } from '@babel/core';

export type PluginOptions = {
  result: [string, string];
  path: string;
};

export type PluginState = {
  dependentNodes: Set<NodePath<Node>>;
  styledNodes: Array<{ shouldExport: boolean; ident: string }>;
};
