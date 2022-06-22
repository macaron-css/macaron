import { style } from '@macaron-css/core';
import { themeClass, vars } from './theme';

const red = style({ backgroundColor: vars.colors.primary });

document.body.classList.add(themeClass);
document.querySelector('#app')!.className = red;
