import { recipe } from '@vanilla-extract/recipes';
import { theme } from './theme';

const text = recipe({
  base: {
    fontFamily: JSON.stringify(theme),
  },
});

export { text };
