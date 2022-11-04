import { createGlobalTheme, macaron$ } from '@macaron-css/core';

export const theme = createGlobalTheme(':root', {});

export const screens = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
};
