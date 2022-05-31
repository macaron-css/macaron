import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { JSX } from 'solid-js';

export function styled<
  TComponent extends keyof JSX.IntrinsicElements,
  Variants extends VariantGroups
>(
  _component: TComponent,
  _options: PatternOptions<Variants>
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
