import {
  buildImport,
  buildModuleExport,
  buildNamedExport,
  registerImportMethod,
} from '../utils';
import { NodePath, types as t } from '@babel/core';
import { PluginState, ProgramScope } from '../types';
import generate from '@babel/generator';
import hash from '@emotion/hash';

export default function postprocess(
  path: NodePath<t.Program>,
  state: PluginState
) {
  const scope = path.scope as ProgramScope;
  const cssFile = scope.macaronData.cssFile;

  const stmts: t.Statement[] = [];

  // for (const style of scope.macaronData.styles) {
  //   stmts.push(style.declaration);

  //   if (style.shouldReExport) {
  //     // TODO reexport
  //   }
  // }

  // this is commented out because
  // it was causing issue with other babel plugins
  // like babel-preset-solid
  // which depends on scope state to add tmpl nodes

  // path.scope.crawl();

  // const dependentNodes = Array.from(state.dependentNodes).map(
  //   binding => binding.node
  // ) as t.Statement[];

  const program = t.program(
    scope.macaronData.nodes.map(node =>
      node.type === 'style' ? node.export : node.node
    ) as t.Statement[]
  );

  // state.dependentNodes.forEach(node => {
  //   stmts;
  //   console.log(node.loc, node.node.loc);
  // });

  // for (const stmt of stmts) {
  //   program.body.push(stmt);
  // }
  const cssExtract = generate(program).code;

  state.opts.result = [cssFile, cssExtract];
}
