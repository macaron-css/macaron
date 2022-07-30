import { registerPlugin, transform } from '@babel/standalone';
import {
  macaronBabelPlugin,
  macaronStyledComponentsPlugin,
} from '@macaron-css/babel/src';
import { style, globalStyle } from '@macaron-css/core';
import { styled } from '@macaron-css/solid';
import { debounce } from '@solid-primitives/scheduled';
import { createStore } from 'solid-js/store';
import Editor from './editor';

registerPlugin('styled', macaronStyledComponentsPlugin);
registerPlugin('macaron', macaronBabelPlugin);

globalStyle('#root', {
  display: 'flex',
  padding: '3vh 3vw',
  minHeight: '100vh',
  maxHeight: '100vh',
});

function macaronTransform(source: string) {
  const options = { result: ['', ''], path: 'index.ts' };

  const result = transform(source, {
    presets: ['typescript', 'react'],
    plugins: ['styled', ['macaron', options]],
    filename: 'index.tsx',
  });

  return { extracted: options.result[1], transpiled: result.code! };
}

function App() {
  const [editor, setEditor] = createStore({
    source: '',
    transpiled: '',
    extracted: '',
  });
  const transform = debounce((source: string) => {
    const { extracted, transpiled } = macaronTransform(source);
    console.log('settings');
    setEditor({ source, transpiled, extracted });
  }, 300);

  return (
    <div
      class={style({
        display: 'flex',
        width: '100%',
        height: '100%',
        gap: '1.5vw',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      })}
    >
      <div class={style({ flex: 1 })}>
        <Heading>Source</Heading>
        <Editor
          class={style({ height: '85vh' })}
          onDocChange={v => transform(v)}
          value={editor.source}
        />
      </div>
      <div
        class={style({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5vh',
        })}
      >
        <div class={style({ width: '100%' })}>
          <Heading>Transpiled</Heading>
          <Editor
            class={style({ height: '40vh' })}
            disabled={true}
            value={editor.transpiled}
          />
        </div>
        <div class={style({ width: '100%' })}>
          <Heading>Extracted</Heading>
          <Editor
            class={style({ height: '40vh' })}
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

export default App;
