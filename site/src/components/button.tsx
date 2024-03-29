import { styled } from '@macaron-css/react';
import { screens } from '../theme';

export const Button = styled('button', {
  base: {
    borderRadius: '50px',
    padding: '13px 25px',
    // marginTop: '10px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    border: 'none',
    '@media': { [screens.sm]: { fontSize: '1rem' } },
  },
  variants: {
    color: {
      primary: {
        color: 'white',
        background: '#ff4089',
      },
      secondary: {
        color: '#ff4089',
        background: 'white',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
