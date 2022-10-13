<p align="center">
<img src="https://raw.githubusercontent.com/macaron-css/macaron/main/banner.jpg" />
</p>

<h1 align="center">macaron</h1>

<p align="center">
CSS-in-JS with <strong>zero runtime</strong>, <strong>type safety</strong> and <strong>colocation</strong>
</p>

## Features

- Powered by [Vanilla Extract](https://vanilla-extract.style/).
- Allows style colocation.
- Zero runtime builds.
- Supports both styled-components API and vanilla styling API.
- [Stitches](https://stitches.dev/)-like variants
- First class Typescript support.
- Out of box support for React and Solid.
- Supports [esbuild](https://esbuild.github.io/) and [Vite](https://vitejs.dev/).

## Setup

macaron currently supports esbuild and vite with the following setup:-

### vite

1. Install the dependencies

```
npm install @macaron-css/core @macaron-css/vite
```

2. Add the vite plugin

```js
import { macaronVitePlugin } from '@macaron-css/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [macaronVitePlugin()],
});
```

### esbuild

1. Install the dependencies

```
npm install @macaron-css/core @macaron-css/esbuild
```

2. Add the esbuild plugin

> If you already have `@vanilla-extract/esbuild-plugin` in your `plugins`, then change `...macaronEsbuildPlugins()` to `macaronEsbuildPlugin()`

```js
const esbuild = require('esbuild');
const { macaronEsbuildPlugins } = require('@macaron-css/esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  plugins: [...macaronEsbuildPlugins()],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
});
```

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

You can try about these above examples at https://macaron-css.vercel.app and see how macaron figures out which expressions have to be extracted and what your code would look like after being transpiled

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
