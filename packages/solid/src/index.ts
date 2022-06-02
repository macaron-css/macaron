import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { JSX, Component } from 'solid-js';

type IntrinsicProps<TComponent> = TComponent extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TComponent]
  : any;

export function styled<TProps, Variants extends VariantGroups>(
  component: Component<TProps>,
  options: PatternOptions<Variants>
): (
  props: TProps & VariantSelection<Variants> & { children?: any }
) => JSX.Element;

export function styled<
  TProps,
  TComponent extends string | keyof JSX.IntrinsicElements,
  Variants extends VariantGroups
>(
  component: TComponent,
  options: PatternOptions<Variants>
): (
  props: IntrinsicProps<TComponent> &
    VariantSelection<Variants> & { children?: any }
) => JSX.Element;

export function styled(
  component: any,
  options: any
): (props: any) => JSX.Element {
  return function StyledComponent(props) {
    throw new Error('Not implemented');
  };
}

export type StyleVariants<T extends (...args: any[]) => any> = Exclude<
  Parameters<T>[0]['variants'],
  undefined
>;
