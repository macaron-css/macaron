import { NodePath, types as t } from '@babel/core';
import { PluginState, ProgramScope } from '../types';
import { styledComponentsVisitor } from '../visitors/styled-components';
import hash from '@emotion/hash';

export default function preprocess(
  path: NodePath<t.Program>,
  state: PluginState
) {
  state.dependentNodes = new Set();
  state.styledNodes = [];
  (path.scope as ProgramScope).macaronData = {
    imports: new Map(),
    styles: [],
    cssFile: `extracted_${hash(path.toString())}.css.ts`,
  };

  // path.traverse(styledComponentsVisitor(path), state);
}
