import { style } from '@macaron-css/core';

const red = style({ backgroundColor: 'red' });

document.querySelector('#app')!.className = red;
