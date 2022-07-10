import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { recipe } from '@vanilla-extract/recipes';
import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { PropsWithChildren, ReactNode } from 'react';
import { $$styled } from './runtime';

type Component<TProps = {}> = (props: TProps) => ReactNode;
type StyledComponent<
  TProps = {},
  Variants extends VariantGroups = {}
> = Component<PropsWithChildren<TProps>> & {
  variants: Array<keyof Variants>;
  selector: (variants: VariantSelection<Variants>) => string;
};

type IntrinsicProps<TComponent> = TComponent extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TComponent]
  : any;

export function styled<TProps, Variants extends VariantGroups = {}>(
  component: Component<TProps>,
  options: PatternOptions<Variants>
): StyledComponent<TProps & VariantSelection<Variants>, Variants>;

export function styled<
  TProps,
  TComponent extends string | keyof JSX.IntrinsicElements,
  Variants extends VariantGroups = {}
>(
  component: TComponent,
  options: PatternOptions<Variants>
): StyledComponent<
  IntrinsicProps<TComponent> & VariantSelection<Variants>,
  Variants
>;

export function styled(component: any, options: any): (props: any) => any {
  const runtimeFn = recipe(options);

  return addFunctionSerializer($$styled(component, runtimeFn as any), {
    importPath: '@macaron-css/react/runtime',
    args: [component, runtimeFn],
    importName: '$$styled',
  });
}

export type StyleVariants<T extends (...args: any[]) => any> = Exclude<
  Parameters<T>[0]['variants'],
  undefined
>;
