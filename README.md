<p align="center">
<img src="https://raw.githubusercontent.com/macaron-css/macaron/main/banner.png" />
</p>

<p align="center">
CSS-in-JS with <strong>zero runtime</strong>, <strong>type safety</strong> and <strong>colocation</strong>
</p>

## Features

<!-- - Powered by [Vanilla Extract](https://vanilla-extract.style/). -->

- Zero runtime bundles with build time style extraction.
- Colocation of styles and components.
- First class Typescript support.
- Supports both styled-components API and vanilla styling API.
- [Stitches](https://stitches.dev/)-like variants API.
- Out of box support for React, Solid and Qwik.
- Integrations for [esbuild](https://esbuild.github.io/) and [Vite](https://vitejs.dev/).

## Documentation

For full documentation, visit [https://macaron.js.org](https://macaron.js.org)

## Example

### Styled API

```jsx
// or import it from @macaron-css/solid
import { styled } from '@macaron-css/react';

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

// Use it like a regular solidjs/react component
function App() {
  return (
    <Button color="accent" size="small" rounded>
      Click me!
    </Button>
  );
}
```

### Styling API

The styling API is the same api as vanilla-extract, but allows styles to be defined in the same file, improving the DX.

Check out [vanilla-extract docs](https://vanilla-extract.style/documentation/api/style/) for the API reference.

These functions can also be called directly inside expressions to provide a `css` prop-like API with zero-runtime cost:-

```js
import { style } from '@macaron-css/core';

function App() {
  return (
    <div
      class={style({
        display: 'flex',
        padding: '10px',
      })}
    >
      <button class={style({ color: 'red' })}>Click me</button>
    </div>
  );
}
```

## Playground

You can try about these above examples at https://macaron.js.org/playground and see how macaron figures out which expressions have to be extracted and what your code would look like after being transpiled

## How it works

[https://macaron.js.org/docs/working/](https://macaron.js.org/docs/working/)

## Acknowledgements

- [Vanilla Extract](https://vanilla-extract.style)
  Thanks to the vanilla-extract team for their work on VE, which macaron uses for evaluating files.

- [Dax Raad](https://twitter.com/thdxr)
  Thanks to Dax for helping me with this and thoroughly testing it outß, helping me find numerous bugs and improving macaron.
