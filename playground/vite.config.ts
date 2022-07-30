import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { macaronVitePlugin } from '@macaron-css/vite';

export default defineConfig({
  plugins: [macaronVitePlugin(), solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
