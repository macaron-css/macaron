import { comptimeCssVitePlugins } from 'comptime-css-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [comptimeCssVitePlugins()],
});
