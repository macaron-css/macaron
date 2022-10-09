import { type NodePath, types as t } from '@babel/core';
import { addNamed } from '@babel/helper-module-imports';
import type { ProgramScope } from './types';

export function invariant(cond: boolean, message: string): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

export function registerImportMethod(
  path: NodePath<t.Node>,
  name: string,
  moduleName = '@macaron-css/core'
) {
  const imports =
    (path.scope.getProgramParent() as ProgramScope).macaronData.imports ||
    ((path.scope.getProgramParent() as ProgramScope).macaronData.imports =
      new Map());

  if (!imports.has(`${moduleName}:${name}`)) {
    let id = addNamed(path, name, moduleName);
    imports.set(`${moduleName}:${name}`, id);
    return id;
  } else {
    let iden = imports.get(`${moduleName}:${name}`)!;
    // the cloning is required to play well with babel-preset-env which is
    // transpiling import as we add them and using the same identifier causes
    // problems with the multiple identifiers of the same thing
    return t.cloneNode(iden);
  }
}

export function getNearestIdentifier(path: NodePath<t.Node>) {
  let currentPath: NodePath<t.Node> | null = path;

  while (currentPath.parentPath !== null) {
    if (currentPath.isIdentifier()) {
      return currentPath;
    }

    let id = currentPath.get('id');
    if (!Array.isArray(id)) {
      if (id.isIdentifier()) return id;
      if (id.isArrayPattern()) {
        for (const el of id.get('elements')) {
          if (el.isIdentifier()) return el;
        }
      }
    }

    let key = currentPath.get('key');
    if (!Array.isArray(key) && key.isIdentifier()) {
      return key;
    }

    currentPath = currentPath.parentPath;
  }

  return null;
}

export const extractionAPIs = [
  // @macaron-css/core
  'macaron$',
  // @vanilla-extract/css
  'style',
  'styleVariants',
  'globalStyle',
  'createTheme',
  'createGlobalTheme',
  'createThemeContract',
  'createGlobalThemeContract',
  'assignVars',
  'createVar',
  'fallbackVar',
  'fontFace',
  'globalFontFace',
  'keyframes',
  'globalKeyframes',
  'style',
  'styleVariants',
  'globalStyle',
  'createTheme',
  'createGlobalTheme',
  'createThemeContract',
  'createGlobalThemeContract',
  'assignVars',
  'createVar',
  'fallbackVar',
  'fontFace',
  'globalFontFace',
  'keyframes',
  'globalKeyframes',
  // @vanilla-extract/recipes
  'recipe',
];
