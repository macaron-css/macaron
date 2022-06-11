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
  dependentNodes: Set<{ loc: Node['loc']; node: Node }>;
  styledNodes: Array<{ isAlreadyExported: boolean; ident: string }>;
  // declarators: Array<t.VariableDeclarator>;
} & PluginPass & { opts: PluginOptions };

export type ProgramScope = Scope & {
  macaronData: {
    imports: Map<string, t.Identifier>;
    bindings: Array<NodePath<t.Node>>;
    nodes: Array<
      | {
          type: 'style';
          export: t.ExportNamedDeclaration;
          // node: t.CallExpression;
          name: string;
          shouldReExport: boolean;
        }
      | { type: 'binding'; node: t.Node }
    >;
    styles: Array<{
      shouldReExport: boolean;
      declaration: t.ExportNamedDeclaration;
      name: string;
    }>;
    cssFile: string;
  };
};
