import { style } from '@macaron-css/core';
import { styled } from '@macaron-css/solid';

const Heading = styled('h1', {
  base: { fontSize: '50px', fontWeight: 'bold' },
});

export default function Home() {
  return (
    <main class={style({ color: 'red' })}>
      <Heading>Hello world!</Heading>
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
