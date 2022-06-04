import { style } from 'comptime-css';

const red = style({ backgroundColor: 'red' });

document.querySelector('#app')!.className = red;
