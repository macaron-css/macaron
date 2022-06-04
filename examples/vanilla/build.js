const { macaronEsbuildPlugins } = require('@macaron-css/esbuild');
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  plugins: [...macaronEsbuildPlugins()],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
});
