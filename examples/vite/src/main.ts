import { style } from 'comptime-css';
import { styled } from 'comptime-css-solid';

export const red = style({ backgroundColor: 'blue' });
const StyledButton = styled('button', {
  base: {
    color: 'blue',
  },
  variants: {
    background: {
      neutral: { background: 'white' },
      dark: { background: 'black' },
    },
  },
});

document.querySelector('#app')!.className = red;

if (import.meta.hot) {
  import.meta.hot.accept(newMod => {
    console.log('UPDATING', newMod);
    document.querySelector('#app')!.className = newMod.red;
  });
}
