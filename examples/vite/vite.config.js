import { comptimeCssVitePlugin } from 'comptime-css-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [comptimeCssVitePlugin()],
});
