import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { createComponent, JSX, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function styled<
  TComponent extends keyof JSX.IntrinsicElements,
  Variants extends VariantGroups
>(
  component: TComponent,
  options: PatternOptions<Variants>
): (
  props: {
    variants: VariantSelection<Variants>;
    children?: any;
  } & JSX.IntrinsicElements[TComponent]
) => JSX.Element {
  return function StyledComponent(props) {
    throw new Error('Not implemented');
  };
}

function C(props: { a: string }) {
  return 'f' as JSX.Element;
}

export function $$styled(component: any, styles = _ => ({})) {
  return function StyledComponent(props: any) {
    const [classes, others] = splitProps(props, ['variants']);
    return createComponent(
      Dynamic as any,
      mergeProps(
        {
          component,
          get ['class']() {
            return styles(classes.variants);
          },
        },
        others
      )
    );
  };
}
