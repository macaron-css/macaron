import { type NodePath, types as t } from '@babel/core';
import * as generator from '@babel/generator';
import type { PluginState, ProgramScope } from '../types';

export default function postprocess(
  path: NodePath<t.Program>,
  state: PluginState
) {
  const programParent = path.scope as ProgramScope;
  const cssExtract = generator.default(
    t.program(programParent.macaronData.nodes as t.Statement[])
  ).code;

  state.opts.result = [programParent.macaronData.cssFile, cssExtract];
}
