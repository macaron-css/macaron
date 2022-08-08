import { createComponent, createMemo, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function $$styled(
  Comp: any,
  styles: ((options: any) => string) & {
    macaronMeta: {
      variants: string[];
      defaultClassName: string;
      variantConcat(options: any): string;
    };
  }
) {
  function StyledComponent(props: any) {
    const [variants, others] = splitProps(props, StyledComponent.variants);

    if (typeof Comp === 'string') {
      return createComponent(
        Dynamic as any,
        mergeProps(others, {
          component: Comp,
          get ['class']() {
            const classes = StyledComponent.classes(variants, props.class);
            return classes.join(' ');
          },
        })
      );
    }

    return createComponent(
      Comp,
      mergeProps(props, {
        get ['class']() {
          const classes = StyledComponent.classes(variants, props.class);
          return classes.join(' ');
        },
      })
    );
  }

  StyledComponent.toString = () => StyledComponent.selector(null);
  StyledComponent.variants = [
    ...(styles.macaronMeta.variants ?? []),
    ...(Comp.variants ?? []),
  ];
  StyledComponent.variantConcat = styles.macaronMeta.variantConcat;
  StyledComponent.classes = (
    variants: any,
    merge?: string,
    fn: any = styles
  ) => {
    const classes = new Set(
      classNames(fn(variants) + (merge ? ` ${merge}` : ''))
    );

    if (Comp.classes) {
      for (const c of Comp.classes(
        variants,
        merge,
        Comp.variantConcat
      ) as string[]) {
        classes.add(c);
      }
    }

    return Array.from(classes);
  };
  StyledComponent.selector = (variants: any) => {
    const classes = StyledComponent.classes(
      variants,
      undefined,
      styles.macaronMeta.variantConcat
    );
    // first element isn't empty
    if (classes.length > 0 && classes[0].length > 0) {
      return '.' + classes.join('.');
    }
    return classes.join('.');
  };

  return StyledComponent;
}

function classNames(className: string) {
  return className.split(' ');
}
