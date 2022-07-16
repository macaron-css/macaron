import { $$styled } from './runtime';
import { createRuntimeFn } from '../../core/src/create-runtime-fn';
import { createComponent } from 'solid-js';

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

  hasClasses(
    createComponent(Component, { size: 'md', class: 'custom_extra_class' }),
    'default size_md color_light custom_extra_class'
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

  expect(InheritedComponent.toString()).toBe(
    '.inherited.default.size_sm.color_light'
  );
  expect(`${InheritedComponent}`).toBe(
    '.inherited.default.size_sm.color_light'
  );

  expect(InheritedComponent.selector({ size: 'md' })).toBe(
    '.inherited.default.size_md.color_light'
  );
  expect(InheritedComponent.selector({ size: 'md', color: 'dark' })).toBe(
    '.inherited.default.size_md.color_dark'
  );
  expect(InheritedComponent.selector({ border: true })).toBe(
    '.inherited.border_true.default.size_sm.color_light'
  );

  expect(InheritedComponent.classes({})).toEqual([
    'inherited',
    'default',
    'size_sm',
    'color_light',
  ]);
  hasClasses(
    createComponent(InheritedComponent, {}),
    'default size_sm color_light inherited'
  );

  hasClasses(
    createComponent(InheritedComponent, {
      size: 'lg',
      class: 'custom_extra_cls',
    }),
    'default size_lg color_light inherited custom_extra_cls'
  );
});

test('inherit custom component', () => {
  const Comp = (props: { class: string }) => `${props.class} custom`;
  const InheritedComponent = $$styled(
    Comp,
    createRuntimeFn({
      defaultClassName: 'double_inherited',
      variantClassNames: {
        border: {
          true: 'border_true',
        },
      },
      compoundVariants: [],
      defaultVariants: {},
    }) as any
  );

  expect(InheritedComponent.selector({})).toBe('.double_inherited');
  expect(
    InheritedComponent.selector({
      border: true,
    })
  ).toBe('.double_inherited.border_true');
  expectRenders(
    createComponent(InheritedComponent, {}),
    'double_inherited custom'
  );
  expectRenders(
    createComponent(InheritedComponent, { border: true }),
    'double_inherited border_true custom'
  );
});

function hasClasses(component: any, classes: string) {
  expectRenders(component, `<div class="${classes} "></div>`);
}

function expectRenders(component: any, output: string) {
  expect(component.t ?? component).toBe(output);
}
