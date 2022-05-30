import { recipe } from '@vanilla-extract/recipes';
import { theme } from './theme';

const button = recipe({
  base: {
    borderRadius: 6,
    color: 'cool',
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

export { button };
