import './globals';

/* @refresh reload */
import { render } from 'solid-js/web';
import { globalStyle } from '@macaron-css/core';

import App from './App';

globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

render(() => <App />, document.getElementById('root') as HTMLElement);
