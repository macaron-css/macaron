import { defineConfig } from 'vite';
import solid from 'solid-start';
import { macaronVitePlugin } from '@macaron-css/vite';

export default defineConfig({
  plugins: [macaronVitePlugin(), solid()],
});
