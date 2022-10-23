import solid from 'solid-start/vite';
import { defineConfig } from 'vite';
import { macaronVitePlugin } from '@macaron-css/vite';

export default defineConfig({
  plugins: [macaronVitePlugin(), solid()],
});
