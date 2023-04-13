import { TransformOptions, transformFileAsync } from '@babel/core';
import {
  macaronBabelPlugin,
  PluginOptions,
  macaronStyledComponentsPlugin,
} from '@macaron-css/babel';

export type BabelOptions = Omit<TransformOptions, 'ast' | 'filename' | 'root' | 'sourceFileName' | 'sourceMaps' | 'inputSourceMap'>;

export async function babelTransform(path: string, babel: BabelOptions = {}) {
  const options: PluginOptions = { result: ['', ''], path };
  const result = await transformFileAsync(path, {
    ...babel,
    plugins: [
      ...(Array.isArray(babel.plugins) ? babel.plugins : []), 
      macaronStyledComponentsPlugin(), 
      [macaronBabelPlugin(), options]
    ],
    presets: [
      ...(Array.isArray(babel.presets) ? babel.presets : []), 
      '@babel/preset-typescript'
    ],
    sourceMaps: false,
  });

  if (result === null || result.code === null)
    throw new Error(`Could not transform ${path}`);

  return { result: options.result, code: result.code };
}
