const { macaronEsbuildPlugins } = require('@macaron-css/esbuild');
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.tsx'],
  plugins: [...macaronEsbuildPlugins()],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
});
