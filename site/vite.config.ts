import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import { defineConfig, UserConfig } from 'vite';
import { macaronVitePlugin } from '@macaron-css/vite';
import { remarkCodeHike } from '@code-hike/mdx';
import theme from 'shiki/themes/github-dark.json';

export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup');

  return {
    optimizeDeps: {
      include: ['react/jsx-runtime'],
    },
    plugins: [
      react(),
      macaronVitePlugin(),
      mdx.default({
        remarkPlugins: [[remarkCodeHike, { theme }]],
      }),
      ssr({ prerender: true }),
    ],
  };
});
