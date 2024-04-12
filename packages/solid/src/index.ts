import { Component, JSX, ParentComponent } from 'solid-js';
import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
  RuntimeFn,
} from '@macaron-css/core/types';

type IntrinsicProps<TComponent> = TComponent extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TComponent]
  : any;

type StyledComponent<
  TProps = {},
  Variants extends VariantGroups = {}
> = ParentComponent<TProps & { class?: string }> & {
  variants: Array<keyof Variants>;
  selector: RuntimeFn<Variants>;
};

export function styled<
  TProps,
  TComponent extends keyof JSX.IntrinsicElements | string,
  Variants extends VariantGroups = {}
>(
  component: TComponent,
  options: PatternOptions<Variants>
): StyledComponent<
  IntrinsicProps<TComponent> & VariantSelection<Variants>,
  Variants
>;

export function styled<TProps, Variants extends VariantGroups = {}>(
  component: Component<TProps>,
  options: PatternOptions<Variants>
): StyledComponent<TProps & VariantSelection<Variants>, Variants>;

export function styled(component: any, options: any): (props: any) => any {
  // the following doesn't work because vanilla-extract's function serializer
  // cannot serialize complex functions like `$$styled`

  // const runtimeFn = recipe(options);

  // return addFunctionSerializer($$styled(component, runtimeFn as any), {
  //   importPath: '@macaron-css/solid/runtime',
  //   args: [component, runtimeFn],
  //   importName: '$$styled',
  // });

  throw new Error(
    "This function shouldn't be there in your final code. If you're seeing this, there is probably some issue with your build config. If you think everything looks fine, then file an issue at https://github.com/mokshit06/macaron/issues"
  );
}

export type StyleVariants<T extends StyledComponent<any, any>> =
  T extends StyledComponent<any, infer TVariants>
    ? VariantSelection<TVariants>
    : unknown;
