# Styling

All styling APIs in macaron take style objects as inputs. These makes the styles type-safe and provides autocomplete via `csstype`. Below are some examples.

### Component-less styles

```js
import { style } from '@macaron-css/core';

const button = style({
  backgroundColor: 'gainsboro',
  borderRadius: '9999px',
  fontSize: '13px',
  border: '0',
});

() => <button class={button}>Button</button>;
```

## Global styles

```js
import { globalStyle } from '@macaron-css/core';

globalStyle('*', {
  margin: 0,
  padding: 0,
});
```

### Base styles

```js
import { styled } from '@macaron-css/solid';

const Button = styled('button', {
  base: {
    backgroundColor: 'gainsboro',
    borderRadius: '9999px',
    fontSize: '13px',
    border: '0',
  },
});

() => <Button>Button</Button>;
```

### Simple Psuedo selectors

Selectors that don't take any parameters can be used at top level

```js
const Button = styled('button', {
  base: {
    // base styles
    ':hover': {
      backgroundColor: 'lightgray',
    },
  },
});

() => <Button>Button</Button>;
```

```js
const Button = styled('button', {
  base: {
    // base styles
    '::before': {
      content: `''`,
      display: 'block',
      backgroundImage: 'linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)',
      position: 'absolute',
      top: '-3px',
      left: '-3px',
      width: 'calc(100% + 6px)',
      height: 'calc(100% + 6px)',
      borderRadius: 'inherit',
      zIndex: -1,
    },
  },
});

() => <Button>Button</Button>;
```

### Complex selectors

More complex selectors can be written inside `selectors`

```js
const Button = styled('button', {
  base: {
    // base styles
    selectors: {
      '&[data-custom-attribute]': {
        boxShadow: '0 0 0 3px royalblue',
      },
    },
  },
});

() => <Button data-custom-attribute>Button</Button>;
```

### Target a macaron component

macaron components implement `.toString()` which returns their base styles' classname. This can be used to target a macaron component.

```js
const Icon = styled('svg', {
  base: {
    display: 'inline-block',
    marginLeft: '5px',
    width: '16px',
  },
});

const Button = styled('button', {
  base: {
    // base styles
    selectors: {
      [`& ${Icon}`]: {
        marginLeft: '5px',
      },
    },
  },
});

() => (
  <Button>
    Button
    <Icon>...</Icon>
  </Button>
);
```

### Target variants of macaron component

macaron components also implement a `selector` method that can be used to get the css selector of the variants applied.

```js
const Icon = styled('svg', {
  base: {
    display: 'inline-block',
    marginLeft: '5px',
  },
  variants: {
    size: {
      small: {
        width: '12px',
      },
      regular: {
        width: '16px',
      },
    },
  },
  defaultVariants: {
    size: 'regular',
  },
});

const Button = styled('button', {
  base: {
    // base styles
    selectors: {
      [`& ${Icon.selector({ size: 'small' })}`]: {
        marginLeft: '5px',
      },
    },
  },
});

() => <Button color="violet">Button</Button>;
```

### Generating styles

There can be cases where you want to generate styles based on some theme config, or programmatically. Directly writing the code to transform the config into styles doesn't work since macaron's compiler only extracts the functions that are exported from macaron, not the closure surrounding it. To make it work, you can use the `macaron$` function. It evaluates the block passed to it at compile time and inlines the value returned in the bundle.

```js
import { macaron$ } from '@macaron-css/core';

const colors = [...];

const styles = macaron$(() => {
  return colors.map(color => style({ backgroundColor: color }))
});
```
