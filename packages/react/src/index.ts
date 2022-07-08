import {
  PatternOptions,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';
import { PropsWithChildren, ReactElement, ReactNode } from 'react';

type Component<TProps = {}> = (props: TProps) => ReactNode;

type IntrinsicProps<TComponent> = TComponent extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TComponent]
  : any;

export function styled<TProps, Variants extends VariantGroups = {}>(
  component: Component<TProps>,
  options: PatternOptions<Variants>
): Component<PropsWithChildren<TProps & VariantSelection<Variants>>>;

export function styled<
  TProps,
  TComponent extends string | keyof JSX.IntrinsicElements,
  Variants extends VariantGroups = {}
>(
  component: TComponent,
  options: PatternOptions<Variants>
): Component<
  PropsWithChildren<IntrinsicProps<TComponent> & VariantSelection<Variants>>
>;

export function styled(
  component: any,
  options: any
): (props: any) => ReactElement {
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
