import { style } from '@macaron-css/core';
import { themeClass, vars } from './theme';

const root = style({
  color: vars.colors.primary,
  fontSize: '2rem',
});

document.body.classList.add(themeClass);
document.querySelector('#app')!.className = root;
