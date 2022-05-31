import { render } from 'solid-js/web';
import { styled, StyleVariants } from '@comptime-css/solid';
import { createStore } from 'solid-js/store';

const Button = styled('button', {
  base: {
    borderRadius: 6,
  },

  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      brand: { background: 'blueviolet' },
      accent: { background: 'slateblue' },
    },
    size: {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 },
    },
    rounded: {
      true: { borderRadius: 999 },
    },
  },

  // Applied when multiple variants are set at once
  compoundVariants: [
    {
      variants: {
        color: 'neutral',
        size: 'large',
      },
      style: {
        background: 'ghostwhite',
      },
    },
  ],

  defaultVariants: {
    color: 'accent',
    size: 'medium',
  },
});

type Variants = StyleVariants<typeof Button>;

function App() {
  return <Button variants={{ color: 'brand' }}>Click Me</Button>;
}

render(() => <App />, document.getElementById('app')!);
