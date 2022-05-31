import { style } from 'comptime-css';

const redButton = style({
  color: 'red',
});

document.write(`
<button class=${redButton}>
  Click me!
</button>
`);
