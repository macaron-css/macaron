# Comptime CSS

- Powered by `vanilla-extract`
- Allows defining styles in the same file as components.
- Supports both styled-components API and plain styling api that returns classes.
- Stitches-like variants
- First class typescript support
- Out of box support for solidjs
- Only supports esbuild as of now

## To be implemented

- Static extraction of styles in expressions.

  Currently the static extraction requires each style that has to be extracted also have a variable declaration. This way it can remove the declaration and add an import with the same identifier.
  It currently **wouldn't** work with this:

  ```js
  import { style } from 'comptime-css';

  let class = `abc ${style({ color: 'red' })}`;
  ```

  but **would** work with this:

  ```js
  import { style } from 'comptime-css';

  let red = style({ color: 'red' });
  let class = `abc ${red}`;
  ```

- Support for other bundlers like rollup

## Example

### Styled API

```jsx
import { styled } from 'comptime-css-solid';

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

## How it works

The esbuild plugin loads every `ts` and `js` file and runs `comptime-css`'s babel plugin on it.

The babel plugin looks for variable declarations in your code and checks if they are of comptime-css's API like `styled` or `recipe` etc.

It finds the styles defined in the currently processed file, looks for all their referenced identifiers, gets all their declarations and repeats this cycle until no more are found and constructs a new babel program of these statements.

It then converts that AST to string and generates a virtual file from it and returns the contents of this virtual file along with the metadata.

It also generates unique filename for these css files based on `murmurhash`.

It also adds imports for those extracted styles in the current file.

It tags all these extracted files in a namespace and pre evaluates them at build time using vanilla-extract

For example, the plugin will transpile:

```js
import { styled } from 'comptime-css-solid';

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
import { _StyledButton } from 'extracted_1747103777.css.ts';
import { $$styled as _$$styled } from 'comptime-css-solid/runtime';

const StyledButton = _$$styled('button', _StyledButton);
```

and

```js
import { createRuntimeFn } from '@vanilla-extract/recipes/createRuntimeFn';

const _StyledButton = createRuntimeFn({
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

module.exports = { _StyledButton };
```

The extracted css will look something like this:

```css
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
