import { createTheme } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { button } from './button';
// import { text } from './text';

const text = () => 'text';

// document.body.className = theme[0];
document.body.innerHTML = `<div class="${button()} ${text()}"></div>`;
