const { comptimeCssPlugins } = require('@comptime-css/esbuild');
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  plugins: [...comptimeCssPlugins()],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
});
