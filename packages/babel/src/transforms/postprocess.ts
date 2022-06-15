import { NodePath, types as t } from '@babel/core';
import generate from '@babel/generator';
import { PluginState, ProgramScope } from '../types';

export default function postprocess(
  path: NodePath<t.Program>,
  state: PluginState
) {
  const programParent = path.scope as ProgramScope;
  const cssExtract = generate(
    t.program(programParent.macaronData.nodes as t.Statement[])
  ).code;

  state.opts.result = [programParent.macaronData.cssFile, cssExtract];
}
