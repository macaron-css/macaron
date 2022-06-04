import { style } from '@macaron-css/core';

const redButton = style({
  color: 'red',
});

document.write(`
<button class=${redButton}>
  Click me!
</button>
`);
