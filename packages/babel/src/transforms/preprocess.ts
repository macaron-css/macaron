import { NodePath, types as t } from '@babel/core';
import { PluginState, ProgramScope } from '../types';
import { StyledComponentsVisitor } from './styledComponents';
import hash from '@emotion/hash';

export default function preprocess(
  path: NodePath<t.Program>,
  state: PluginState
) {
  state.dependentNodes = new Set();
  state.styledNodes = [];
  (path.scope as ProgramScope).macaronData = {
    imports: new Map(),
    cssFile: `extracted_${hash(path.toString())}.css.ts`,
    nodes: [],
    bindings: [],
  };

  path.traverse(StyledComponentsVisitor, state);
}
