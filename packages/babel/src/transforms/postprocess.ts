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

  for (const style of scope.macaronData.styles) {
    stmts.push(style.declaration);

    if (style.shouldReExport) {
      // TODO reexport
    }
  }

  // this is commented out because
  // it was causing issue with other babel plugins
  // like babel-preset-solid
  // which depends on scope state to add tmpl nodes

  // path.scope.crawl();

  // const ast = buildModuleExport({
  //   nodes: t.objectExpression(
  //     scope.macaronData.styles.map(style => {
  //       return t.objectProperty(
  //         t.identifier(style.declaration.declarations[0].id.name),
  //         t.identifier(style.name)
  //       );
  //     })
  //   ),
  // });

  const program = t.program(
    [...(state.dependentNodes as any)].map(path => {
      if (!('parent' in path)) return path;
      if (path.parent.type === 'Program') {
        return path.node as any;
      } else {
        return path.parent as any;
      }
    })
  );
  for (const stmt of stmts) {
    program.body.unshift(stmt);
  }
  const cssExtract = generate(program).code;

  state.opts.result = [cssFile, cssExtract];
}
