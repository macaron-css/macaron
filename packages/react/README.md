# macaron

macaron is a zero-runtime and type-safe CSS-in-JS library made with performance in mind

- Powered by **vanilla-extract**
- Allows defining styles in the same file as components
- Zero runtime builds
- Supports both styled-components API and plain styling api that returns classes.
- Stitches-like variants
- First class typescript support
- Out of box support for react and solidjs
- Supports esbuild and vite (with hmr)

## Example

### Styled API

```jsx
import { styled } from '@macaron-css/solid';

const StyledButton = styled('button', {
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

// Use it like a regular solidjs component
function App() {
  return (
    <StyledButton color="accent" size="small" rounded={true}>
      Click me!
    </StyledButton>
  );
}
```

### Styling API

The styling API is the same api is vanilla-extract, but allows styles to be defined in the same file, increasing the authoring experience.

Check out [vanilla-extract docs](https://vanilla-extract.style/documentation/styling-api/)
