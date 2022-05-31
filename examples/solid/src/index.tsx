import { render } from 'solid-js/web';
import { styled } from '@comptime-css/solid';

const Button = styled('button', {
  base: {
    color: 'red',
  },
});

render(() => <Button>Works</Button>, document.getElementById('app')!);
