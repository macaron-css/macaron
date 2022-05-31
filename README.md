# Comptime CSS

- `vanilla-extract` like-api but allows defining styles in the same file as components.
- Supports both styled-components API and plain classnames.
- Stitches-like variants
- First class typescript support
- Out of box support for solidjs
- Only supports esbuild as of now

## Example

### Styled API

```jsx
import { styled } from 'comptime-css/styled';

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

### Classnames API

The classnames API is the same api is vanilla-extract, but allows styles to be defined in the same file, increasing the authoring experience.

Check out [vanilla-extract docs](https://vanilla-extract.style/documentation/styling-api/)

## How it works

The esbuild plugin loads every `ts` and `js` file and runs `comptime-css`'s babel plugin on it, which extracts the styles defined in the currently processes file and extracts them into a virtual file.
It also adds imports for those extracted styles in the current file.

It tags all these extracted files in a namespace and pre evaluates them at build time.
