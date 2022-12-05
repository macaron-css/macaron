import { render } from 'solid-js/web';
import App from './App';
import { globalStyle } from '@macaron-css/core';

globalStyle('*', {
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
});

render(() => <App />, document.getElementById('app')!);
