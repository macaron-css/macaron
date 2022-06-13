# macaron

> comptime-css is now called **macaron**!

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
// or import it from @macaron-css/react
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

// Use it like a regular solidjs/react component
function App() {
  return (
    <StyledButton color="accent" size="small" rounded>
      Click me!
    </StyledButton>
  );
}
```

### Styling API

The styling API is the same api is vanilla-extract, but allows styles to be defined in the same file, increasing the authoring experience.

Check out [vanilla-extract docs](https://vanilla-extract.style/documentation/styling-api/) for the API reference.

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

## How it works

The esbuild/vite plugin loads every `ts` and `js` file and runs `@macaron-css/babel` plugin on it.

The babel plugin looks for call expressions in your code and checks if the callee is a macarons API like `styled` or `recipe` etc.

It traverses the call expressions and finds all the referenced identifiers, gets all their declarations and repeats this cycle until no more are found and constructs a new babel program of these statements.

It then converts that AST to string and generates a virtual file from it and returns the contents of this virtual file along with the metadata and adds imports for those extracted styles in the current file.

It also generates unique filename for these css files based on `murmurhash`.

It tags all these extracted files in a namespace and pre evaluates them at build time using vanilla-extract

For example, the plugin will transpile:

```js
// main.ts
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
  },
  defaultVariants: {
    color: 'accent',
  },
});
```

To This:

```js
// main.ts
import { $macaron$$StyledButton } from 'extracted_1747103777.css.ts';
import { $$styled } from '@macaron-css/solid/runtime';

const StyledButton = $$styled('button', $macaron$$StyledButton);

// extracted_1747103777.css.ts
import { recipe } from '@macaron-css/core';

export var $macaron$$StyledButton = recipe({
  base: {
    borderRadius: 6,
  },
  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      brand: { background: 'blueviolet' },
      accent: { background: 'slateblue' },
    },
  },
  defaultVariants: {
    color: 'accent',
  },
});
```

Which gets further compiled to:

```js
// extracted_1747103777.css.ts
import 'extracted_1747103777.vanilla.css';
import { createRuntimeFn } from '@macaron-css/core/create-runtime-fn';

export var $macaron$$StyledButton = createRuntimeFn({
  defaultClassName: 'extracted_1747103777__1g7h5za0',
  variantClassNames: {
    color: {
      neutral: 'extracted_1747103777_color_neutral__1g7h5za1',
      brand: 'extracted_1747103777_color_brand__1g7h5za2',
      accent: 'extracted_1747103777_color_accent__1g7h5za3',
    },
  },
  defaultVariants: {
    color: 'accent',
  },
});
```

The extracted css will look something like this:

```css
/* extracted_1747103777.vanilla.css */
.extracted_1747103777__1g7h5za0 {
  border-radius: 6px;
}
.extracted_1747103777_color_neutral__1g7h5za1 {
  background: whitesmoke;
}
.extracted_1747103777_color_brand__1g7h5za2 {
  background: blueviolet;
}
.extracted_1747103777_color_accent__1g7h5za3 {
  background: slateblue;
}
```
