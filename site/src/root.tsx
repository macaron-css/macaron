// @refresh reload
import { Suspense } from 'solid-js';
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start';
import { style, globalStyle } from '@macaron-css/core';
import { screens } from './theme';

globalStyle('*', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
});

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>macaron - </Title>
        <Meta charset="utf-8" />
        <Link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <Link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body
        class={style({
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          background: 'linear-gradient(to bottom, #131936f3 20%, #282a4ff2)',
          fontFamily: "'Public Sans', system-ui",
        })}
      >
        <ErrorBoundary>
          {/* <A href="/">Index</A>
          <A href="/about">About</A> */}
          <div></div>
          <Suspense>
            <main
              class={style({
                width: '100%',
                maxWidth: '1200px',
                padding: '0 3vw',
                '@media': {
                  [screens.lg]: {
                    maxWidth: '700px',
                    padding: '6vh 20px',
                  },
                },
              })}
            >
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
