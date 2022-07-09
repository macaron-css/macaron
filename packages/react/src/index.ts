import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { PropsWithChildren, ReactNode } from 'react';

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
  return function StyledComponent(props) {
    throw new Error(
      'This function should be stripped out at runtime. This error usually occurs if there is something wrong with the build configuration. If you think that the configuration is fine, then open an issue here `https://github.com/mokshit06/macaron/issues`'
    );
  };
}

export type StyleVariants<T extends (...args: any[]) => any> = Exclude<
  Parameters<T>[0]['variants'],
  undefined
>;
