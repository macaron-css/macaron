import { createSignal } from 'solid-js';
import { styled } from '@macaron-css/solid';

const Button = styled('button', {
  base: {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    padding: '1em 2em',
    color: '#335d92',
    backgroundColor: 'rgba(68, 107, 158, 0.1)',
    borderRadius: '2em',
    border: '2px solid rgba(68, 107, 158, 0)',
    outline: 'none',
    width: '200px',
    fontVariantNumeric: 'tabular-nums',
    ':focus': {
      border: '2px solid #335d92',
    },
    ':active': {
      backgroundColor: 'rgba(68, 107, 158, 0.2)',
    },
  },
});

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <Button onClick={() => setCount(count() + 1)}>Clicks: {count()}</Button>
  );
}
