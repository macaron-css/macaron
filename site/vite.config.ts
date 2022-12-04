import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import { defineConfig, UserConfig } from 'vite';
import { macaronVitePlugin } from '@macaron-css/vite';
import { remarkCodeHike } from '@code-hike/mdx';
import theme from 'shiki/themes/material-ocean.json';

export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup');

  return {
    define: {
      BABEL_TYPES_8_BREAKING: 'false',
      'process.env.BABEL_TYPES_8_BREAKING': 'false',
    },
    optimizeDeps: {
      include: ['react/jsx-runtime'],
    },
    plugins: [
      react(),
      macaronVitePlugin(),
      mdx.default({
        remarkPlugins: [[remarkCodeHike, { theme }]],
        rehypePlugins: [
          // esm packages, so can't import directly
          await import('rehype-slug').then(r => r.default),
          [
            await import('rehype-autolink-headings').then(r => r.default),
            {
              properties: { id: 'mdx-link', tabIndex: -1, ariaHidden: true },
            },
          ],
        ],
      }),
      ssr({ prerender: true }),
    ],
  };
});
