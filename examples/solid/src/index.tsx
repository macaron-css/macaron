import { render } from 'solid-js/web';
import { styled } from '@comptime-css/solid';
import { recipe } from 'comptime-css';

const Button = styled('button', {
  base: {
    color: 'red',
  },
});

render(() => <Button>Works</Button>, document.getElementById('app')!);
