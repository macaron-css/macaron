import { NodePath, Node, types as t, PluginPass } from '@babel/core';
import { Scope } from '@babel/traverse';

export type PluginOptions = {
  result: [string, string];
  /**
   * @deprecated no longer used
   */
  path?: string;
};

export type PluginState = {
  dependentNodes: Set<NodePath<Node>>;
  styledNodes: Array<{ isAlreadyExported: boolean; ident: string }>;
  // declarators: Array<t.VariableDeclarator>;
} & PluginPass & { opts: PluginOptions };

export type ProgramScope = Scope & {
  macaronData: {
    imports: Map<string, t.Identifier>;
    styles: Array<{
      shouldReExport: boolean;
      declaration: t.ExportNamedDeclaration;
      name: string;
    }>;
    cssFile: string;
  };
};
