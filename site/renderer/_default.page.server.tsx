import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { PageShell } from './PageShell';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr';
import type { PageContextServer } from './types';

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname'];

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title =
    (documentProps && documentProps.title) ||
    'macaron — CSS-in-JS with zero-runtime';
  const desc =
    (documentProps && documentProps.description) ||
    'Typesafe CSS-in-JS with zero runtime, colocation, maximum safety and productivity. Macaron is a new compile time CSS-in-JS library with type safety.';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <link rel="icon" href="/macaron-symbol.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <title>${title}</title>
        <meta property="og:title" content="macaron — Colocated CSS-in-JS with zero-runtime" />
        <meta property="og:description" content="Typesafe CSS-in-JS with zero runtime, colocation, maximum safety and productivity. Macaron is a new compile time CSS-in-JS library with type safety." />
        <meta name="og:locale" content="en_US" />
        <meta name="twitter:site" content="@mokshit06" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://macaron.js.org/share.jpg" />
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
