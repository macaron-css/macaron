import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import {
  Component,
  JSXChildren,
  QwikIntrinsicElements,
} from '@builder.io/qwik';

type IntrinsicProps<TComponent> = TComponent extends keyof QwikIntrinsicElements
  ? QwikIntrinsicElements[TComponent]
  : any;

type StyledComponent<
  TProps = {},
  Variants extends VariantGroups = {}
> = Component<TProps & { class?: string; children?: JSXChildren }> & {
  variants: Array<keyof Variants>;
  selector: (variants: VariantSelection<Variants>) => string;
};

export function styled<
  TProps,
  TComponent extends string | keyof QwikIntrinsicElements,
  Variants extends VariantGroups = {}
>(
  component: TComponent,
  options: PatternOptions<Variants>
): StyledComponent<
  IntrinsicProps<TComponent> & VariantSelection<Variants>,
  Variants
>;

export function styled<TProps, Variants extends VariantGroups = {}>(
  component: Component<TProps & {}>,
  options: PatternOptions<Variants>
): StyledComponent<TProps & VariantSelection<Variants>, Variants>;

export function styled(component: any, options: any): any {
  // the following doesn't work because vanilla-extract's function serializer
  // cannot serialize complex functions like `$$styled`

  // const runtimeFn = recipe(options);

  // return addFunctionSerializer($$styled(component, runtimeFn as any), {
  //   importPath: '@macaron-css/qwik/runtime',
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
