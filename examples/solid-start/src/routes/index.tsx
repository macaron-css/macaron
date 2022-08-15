import { style, recipe } from '@macaron-css/core';
import { styled } from '@macaron-css/solid';
import { vars, themeClass } from '../theme';

const Heading = styled('h1', {
  base: { fontSize: '50px', fontWeight: 'bold', color: vars.colors.red },
});
const customClass = recipe({
  base: {
    color: 'red',
  },
});

export default function Home() {
  return (
    <main class={style({ color: 'red' })}>
      <div class={themeClass}>
        <Heading>Hello world!</Heading>
      </div>
      <p class={customClass()}>
        Visit{' '}
        <a href="https://solidjs.com" target="_blank">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
    </main>
  );
}
