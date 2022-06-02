import { template } from '@babel/core';

export const buildImport = template(
  'import { %%specifier%% as %%alias%% } from %%source%%;'
);
export const buildModuleExport = template('module.exports = %%nodes%%');
export const buildNamedExport = template('export { %%ident%% }');
export const buildComponentStyle = template(`
const %%className%% = %%recipeImport%%(%%styles%%);
`);
export const buildComponent = template(
  `const %%component%% = /* @__PURE__ */ %%styledImport%%(%%tag%%, %%className%%);`
);

export function invariant(cond: boolean, message: string): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}
