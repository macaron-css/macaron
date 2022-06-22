import { style } from '@macaron-css/core';
import { themeClass, vars } from './theme';

const redButton = style({
  color: vars.colors.primary,
});

document.body.classList.add(themeClass);

document.write(`
<button class=${redButton}>
  Click me!
</button>
`);
