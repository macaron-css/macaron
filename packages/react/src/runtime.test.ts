import { $$styled } from './runtime';
import { createRuntimeFn } from '../../core/dist/create-runtime-fn';

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

  expect(Component.toString()).toBe('.default.size_sm.color_light');
  expect(`${Component}`).toBe('.default.size_sm.color_light');

  expect(Component.selector({ size: 'md' })).toBe(
    '.default.size_md.color_light'
  );
  expect(Component.selector({ size: 'md', color: 'dark' })).toBe(
    '.default.size_md.color_dark'
  );
});

test.skip('inherit component', () => {
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

  expect(InheritedComponent.toString()).toBe(
    '.default.size_sm.color_light.inherited'
  );
  expect(`${InheritedComponent}`).toBe(
    '.default.size_sm.color_light.inherited'
  );

  expect(InheritedComponent.selector({ size: 'md' })).toBe(
    '.default.size_md.color_light.inherited'
  );
  expect(InheritedComponent.selector({ size: 'md', color: 'dark' })).toBe(
    '.default.size_md.color_dark.inherited'
  );
  expect(InheritedComponent.selector({ border: true })).toBe(
    '.default.size_sm.color_light.inherited.border_true'
  );
});
