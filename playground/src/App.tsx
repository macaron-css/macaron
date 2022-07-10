import { macaronBabelPlugin } from '@macaron-css/babel';
import { transform, registerPlugin, availablePresets } from '@babel/standalone';
import { createStore } from 'solid-js/store';
import { debounce } from '@solid-primitives/scheduled';

registerPlugin('macaron', macaronBabelPlugin);

function macaronTransform(source: string) {
  const options = { result: ['', ''], path: 'index.ts' };

  const result = transform(source, {
    presets: ['typescript', 'react'],
    plugins: [['macaron', options]],
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
    setEditor({ source, transpiled, extracted });
  }, 300);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <textarea
        style={{ width: '50vw' }}
        value={editor.source}
        onInput={e => {
          transform(e.currentTarget.value);
        }}
      />
      <div
        style={{ display: 'flex', 'flex-direction': 'column', width: '50vw' }}
      >
        <div style={{ height: '50vh', width: '100%' }}>
          <h2>Transpiled</h2>
          <pre style={{ overflow: 'scroll', display: 'block' }}>
            {editor.transpiled}
          </pre>
        </div>
        <hr />
        <div style={{ height: '50vh', width: '100%' }}>
          <h2>Extracted</h2>
          <pre style={{ overflow: 'scroll', display: 'block' }}>
            {editor.extracted}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
