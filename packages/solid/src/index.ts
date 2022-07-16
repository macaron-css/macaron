import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { recipe } from '@vanilla-extract/recipes';
import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { Component, JSX, ParentComponent } from 'solid-js';
import { $$styled } from './runtime';

type IntrinsicProps<TComponent> = TComponent extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TComponent]
  : any;

type StyledComponent<
  TProps = {},
  Variants extends VariantGroups = {}
> = ParentComponent<TProps & VariantSelection<Variants>> & {
  variants: Array<keyof Variants>;
  selector: (variants: VariantSelection<Variants>) => string;
};

export function styled<TProps, Variants extends VariantGroups = {}>(
  component: Component<TProps>,
  options: PatternOptions<Variants>
): StyledComponent<TProps, Variants>;

export function styled<
  TProps,
  TComponent extends string | keyof JSX.IntrinsicElements,
  Variants extends VariantGroups = {}
>(
  component: TComponent,
  options: PatternOptions<Variants>
): StyledComponent<IntrinsicProps<TComponent>, Variants>;

export function styled(component: any, options: any): (props: any) => any {
  const runtimeFn = recipe(options);

  return addFunctionSerializer($$styled(component, runtimeFn as any), {
    importPath: '@macaron-css/solid/runtime',
    args: [component, runtimeFn],
    importName: '$$styled',
  });
}

export type StyleVariants<T extends (...args: any[]) => any> = Exclude<
  Parameters<T>[0]['variants'],
  undefined
>;
