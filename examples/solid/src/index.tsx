import { render } from 'solid-js/web';
import { styled, StyleVariants } from '@macaron-css/solid';
import { style } from '@macaron-css/core';
import { Button, color } from './button';

type Variants = StyleVariants<typeof Button>;

function App() {
  return (
    // inline styles with zero-runtime cost
    <div class={style({ color })}>
      <Button color="brand" size="medium">
        Click Me
      </Button>
    </div>
  );
}

render(() => <App />, document.getElementById('app')!);
