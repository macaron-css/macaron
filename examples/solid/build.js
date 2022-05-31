const { comptimeCssPlugins } = require('@comptime-css/esbuild');
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.tsx'],
  plugins: [...comptimeCssPlugins()],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
});
