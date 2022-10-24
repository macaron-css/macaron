import { $$styled } from './runtime';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createRuntimeFn } from '../../core/src/create-runtime-fn';

function makeComponent() {
  return $$styled(
    'div',
    createRuntimeFn({
      defaultClassName: 'default',
      variantClassNames: {
        size: {
          sm: 'size_sm',
          md: 'size_md',
          lg: 'size_lg',
        },
        color: {
          light: 'color_light',
          dark: 'color_dark',
        },
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'sm',
        color: 'light',
      },
    }) as any
  );
}

test('component has variants', () => {
  const Component = makeComponent();

  expect(Component.variants).toEqual(['size', 'color']);
});

test('component as selector', () => {
  const Component = makeComponent();

  expect(Component.toString()).toBe('.default');
  expect(`${Component}`).toBe('.default');

  expect(Component.selector({ size: 'md' })).toBe('.default.size_md');
  expect(Component.selector({ size: 'md', color: 'dark' })).toBe(
    '.default.size_md.color_dark'
  );
});

test('base component renders correctly', () => {
  const Component = makeComponent();

  expectRendersSnapshot(
    createElement(Component, { size: 'md', className: 'custom_extra_class' })
  );
});

test('inherit styled component', () => {
  const Component = makeComponent();
  const InheritedComponent = $$styled(
    Component,
    createRuntimeFn({
      defaultClassName: 'inherited',
      variantClassNames: {
        border: {
          true: 'border_true',
        },
      },
      compoundVariants: [],
      defaultVariants: {},
    }) as any
  );

  // expect(InheritedComponent.toString()).toBe('.inherited.default');
  // expect(`${InheritedComponent}`).toBe('.inherited.default');

  expect(InheritedComponent.selector({ size: 'md' })).toBe(
    '.inherited.default.size_md'
  );
  expect(InheritedComponent.selector({ size: 'md', color: 'dark' })).toBe(
    '.inherited.default.size_md.color_dark'
  );
  expect(InheritedComponent.selector({ border: true })).toBe(
    '.inherited.border_true.default'
  );

  expect(InheritedComponent.classes({})).toEqual(['inherited', 'default']);

  expectRendersSnapshot(createElement(InheritedComponent, {}));
  expectRendersSnapshot(
    createElement(InheritedComponent, {
      size: 'lg',
      className: 'custom_extra_cls',
    })
  );
});

function expectRendersSnapshot(component: any) {
  expect(renderToString(component)).toMatchSnapshot();
}
