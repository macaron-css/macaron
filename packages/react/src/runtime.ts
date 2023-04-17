import { useMemo, createElement, forwardRef, FC } from 'react';

export function $$styled(
  Comp: any,
  styles: ((options?: any) => string) & {
    macaronMeta: {
      variants: string[];
      defaultClassName: string;
      variantConcat(options: any): string;
    };
  }
) {
  const StyledComponent: any = forwardRef(({ as, ...props }: any, ref) => {
    let CompToRender = as ?? Comp;
    const [variants, others] = useMemo(() => {
      const [classes, others]: any[] = [{}, {}];

      for (const [key, value] of Object.entries(props)) {
        if (StyledComponent.variants.includes(key)) {
          classes[key] = value;
        } else {
          others[key] = value;
        }
      }

      return [classes, others];
    }, [props]);
    const className = useMemo(() => {
      const classes = StyledComponent.classes(variants, props.className);
      return classes.join(' ');
    }, [variants, props.className]);

    if (typeof CompToRender === 'string') {
      return createElement(CompToRender, { ...others, className, ref });
    }

    return createElement(CompToRender, { ...props, className, ref });
  });

  StyledComponent.displayName = `Macaron(${Comp})`;
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
