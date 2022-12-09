import { style } from '@macaron-css/core';
import React from 'react';

const fileMap = {
  react: 'src/App.tsx',
  solid: 'src/App.tsx',
  'solid-start': 'src/routes/index.tsx',
  vanilla: 'src/index.ts',
  vite: 'src/main.ts',
};

export function Stackblitz({ example }: { example: keyof typeof fileMap }) {
  return (
    <div
      className={style({
        position: 'relative',
      })}
    >
      <iframe
        src={`https://stackblitz.com/github/macaron-css/macaron/tree/main/examples/${example}?embed=1&file=src/index.ts`}
        className={style({
          width: '100%',
          borderRadius: '12px',
          height: '71vh',
          border: '2px solid #7977af2b',
        })}
      />
    </div>
  );
}
