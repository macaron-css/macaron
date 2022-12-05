import ReactDOM from 'react-dom/client';
import App from './App';
import { globalStyle } from '@macaron-css/core';
import { StrictMode } from 'react';

globalStyle('*', {
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
