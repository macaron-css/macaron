import { transformSync } from '@babel/core';
import { macaronBabelPlugin } from './index';
import { PluginOptions } from './types';

function babelTransform(code: string) {
  const options: PluginOptions = { result: ['', ''] };
  const result = transformSync(code, {
    plugins: [[macaronBabelPlugin(), options]],
    presets: ['@babel/preset-typescript'],
    filename: 'test.tsx',
  });

  if (result === null || result.code === null)
    throw new Error(`Could not transform`);

  return { result: options.result, code: result.code };
}

test('export default style', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    
    export default style({
      color: 'red'
    })
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('inside jsx expression', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    
    function App() {
      return <div class={style({
        color: 'red'
      })}>Hello</div>
    }

    console.log(red);
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('hoists inline expression', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    const str = \`abc \${style({ color: 'red' })}\`
    console.log(str)
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('hoists object property', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    const obj = {
      nested: {
        key: style({ color: 'red' })
      }
    }
    console.log(obj)
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('hoists array member', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    const arr = [1, 2, style({ color: 'red' }), 4, style({ color: 'blue' })]
    console.log(arr)
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test.skip('extracts style function', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    
    const red = style({ color: 'red' });
    console.log(red);
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('multiple variable declarators in one declaration', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    
    const red = style({ color: 'red' }),
      blue = style({ color: 'blue' }),
      green = style({ color: 'green' });

    console.log(red, blue, green);
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('move bindings along with extracted style', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';

    const redColor = 'red';
    
    const red = style({ color: redColor });
    console.log(red);
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('inside block scope', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';
    
    {
      const red = style({ color: 'red' });

      console.log(red);
    }
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test.skip('styled components', () => {
  const { result, code } = babelTransform(`
    import { styled } from '@macaron-css/solid';
    
    const Button = styled("button", {
      base: { color: 'red' }
    })

    console.log(Button)
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('already exported', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';

    export const red = style({ color: 'red' });
    console.log(red);
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

// doesn't work
test('hoisting same variable name in different scope', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';

    const red = style({ color: 'red' });
    console.log(red);

    function SomeComponent() {
      const red = style({ color: 'blue' });
      console.log(red)
    }
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test('array pattern hoisting', () => {
  const { result, code } = babelTransform(`
    import { createTheme } from '@macaron-css/core';

    const [themeClass, vars] = createTheme({
      colors: {
        brand: 'red'
      }
    });
    console.log(themeClass, vars);
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

test.only('same binding in multiple declarations', () => {
  const { result, code } = babelTransform(`
    import { style } from '@macaron-css/core';

    const color = 'red';
    const foreground = style({ color });
    const background = style({ background: color });

    console.log(foreground, background)
  `);

  expect(result).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});
