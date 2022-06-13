import { NodePath, types as t } from '@babel/core';
import generate from '@babel/generator';
import { PluginState, ProgramScope } from '../types';

export default function postprocess(
  path: NodePath<t.Program>,
  state: PluginState
) {
  const programParent = path.scope as ProgramScope;

  const program = t.program(
    programParent.macaronData.nodes.map(node =>
      node.type === 'style' ? node.export : node.node
    ) as t.Statement[]
  );

  const cssExtract = generate(program).code;

  state.opts.result = [programParent.macaronData.cssFile, cssExtract];
}
