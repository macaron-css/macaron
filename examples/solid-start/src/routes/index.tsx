import { style } from '@macaron-css/core';

export default function Home() {
  return (
    <main class={style({ color: 'red' })}>
      <h1>Hello world!</h1>
      <p>
        Visit{' '}
        <a href="https://solidjs.com" target="_blank">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
    </main>
  );
}
