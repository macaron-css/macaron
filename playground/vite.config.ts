import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
