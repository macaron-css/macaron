# Installation

How to install macaron and get started.

### Install macaron

```bash
# npm
npm install @macaron-css/core @macaron-css/solid # or @macaron-css/react

# yarn
yarn add @macaron-css/core @macaron-css/solid # or @macaron-css/react
```

### Setting up bundler

Macaron currently supports vite and esbuild. Install and setup the plugin for your bundler :-

#### Vite

```bash
npm install @macaron-css/vite
```

In the `vite.config.js`, add the macaron plugin before other plugins

```js line=5
import { macaronVitePlugin } from '@macaron-css/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [macaronVitePlugin() /** other plugins */],
});
```

#### esbuild

```bash
npm install @macaron-css/esbuild
```

Add macaron plugin to the esbuild config

```js line=6
const { macaronEsbuildPlugins } = require('@macaron-css/esbuild');
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.tsx'],
  plugins: [...macaronEsbuildPlugins()],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
});
```

### Import it

Import `styled` from `@macaron-css/solid`

```js
import { styled } from '@macaron-css/solid';
```

### Use it

Use the `styled` function to create a style:-

```js
import { styled } from '@macaron-css/solid';

const Button = styled('button', {
  base: {
    backgroundColor: 'gainsboro',
    borderRadius: '9999px',
    fontSize: '13px',
    padding: '10px 15px',
    ':hover': {
      backgroundColor: 'lightgray',
    },
  },
});
```

Unlike vanilla-extract that restricts style declarations to `.css.ts`, macaron allows you to declare styles in the same file providing _true_ colocation.

### Render it

```js
import { styled } from '@macaron-css/solid';

const Button = styled('button', {...});

() => <Button>Button</Button>;
```

### Available functions

Other than `styled`, macaron provides the following functions:-

```js
import { styled } from '@macaron-css/solid';

import {
  __style__,
  __recipe__,
  __createTheme__,
  __createThemeContract__,
  __styleVariants__,
  __createVar__,
  __fallbackVar__,
  __assignVars__,
  __keyframs__,
  __fontFace__,
  __createContainer__,
} from '@macaron-css/core';
```
