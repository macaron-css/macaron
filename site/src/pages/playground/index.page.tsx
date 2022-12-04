import './setup';
import { registerPlugin, transform } from '@babel/standalone';
import {
  macaronBabelPlugin,
  macaronStyledComponentsPlugin,
} from '@macaron-css/babel/src';
import { style } from '@macaron-css/core';
import { styled } from '@macaron-css/react';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';
import React from 'react';

function Editor(props: any) {
  const [Comp, setComp] = useState(null as any);

  useEffect(() => {
    import('./editor').then(Comp => {
      setComp(Comp);
    });
  }, []);

  return Comp && <Comp.default {...props} />;
}

if (typeof document !== 'undefined') {
  registerPlugin('styled', macaronStyledComponentsPlugin);
  registerPlugin('macaron', macaronBabelPlugin);
}

function macaronTransform(source: string) {
  const options = { result: ['', ''], path: 'index.ts' };

  const result = transform(source, {
    presets: ['typescript', 'react'],
    plugins: ['styled', ['macaron', options]],
    filename: 'index.tsx',
  });

  return { extracted: options.result[1], transpiled: result.code! };
}

export function Page() {
  const [editor, setEditor] = useState({
    source: `import { styled } from '@macaron-css/react';

const Button = styled('button', {
  base: {
    borderRadius: 6,
  },
  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      brand: { background: 'blueviolet' },
      accent: { background: 'slateblue' },
    },
    size: {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 },
    },
    rounded: {
      true: { borderRadius: 999 },
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'neutral',
        size: 'large',
      },
      style: {
        background: 'ghostwhite',
      },
    },
  ],

  defaultVariants: {
    color: 'accent',
    size: 'medium',
  },
});
`,
    transpiled: '',
    extracted: '',
  });
  const transform = useDebouncedCallback((source: string) => {
    const { extracted, transpiled } = macaronTransform(source);
    setEditor({ source, transpiled, extracted });
  }, 300);

  useEffect(() => {
    transform(editor.source);
  }, []);

  return (
    <div
      className={style({
        display: 'flex',
        width: '100%',
        color: 'white',
        height: '100%',
        gap: '1.5vw',
        padding: '2rem',
      })}
    >
      <div className={style({ flex: 1 })}>
        <Heading>Source</Heading>
        <Editor
          class={style({ height: '80vh' })}
          onDocChange={transform}
          value={editor.source}
        />
      </div>
      <div
        className={style({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: '1.5vh',
        })}
      >
        <div className={style({ width: '100%', flex: 1, maxHeight: '50%' })}>
          <Heading>Transpiled</Heading>
          <Editor
            class={style({ height: '36vh' })}
            disabled={true}
            value={editor.transpiled}
          />
        </div>
        <div className={style({ width: '100%', flex: 1, maxHeight: '50%' })}>
          <Heading>Extracted</Heading>
          <Editor
            class={style({ height: '37vh' })}
            disabled
            value={editor.extracted}
          />
        </div>
      </div>
    </div>
  );
}

const Heading = styled('h2', {
  base: { fontSize: '1.7rem', marginBottom: '10px' },
});
