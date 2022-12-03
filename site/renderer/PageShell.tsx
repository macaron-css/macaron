import React from 'react';
import { PageContextProvider } from './usePageContext';
import type { PageContext } from './types';
import { globalStyle } from '@macaron-css/core';
import '@code-hike/mdx/styles';

globalStyle('*', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
});

globalStyle('body', {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #0a0d1bf3 20%, #171728f2)',
  backgroundAttachment: 'fixed',
});

globalStyle('a', {
  textDecoration: 'none',
});

globalStyle('#page-view', {
  display: 'flex',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  minHeight: '100vh',
  justifyContent: 'center',
  // alignContent: 'center',
  fontFamily: "'Public Sans', system-ui",
});

export function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        {children}
      </PageContextProvider>
    </React.StrictMode>
  );
}
