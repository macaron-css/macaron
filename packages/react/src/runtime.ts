import { useMemo, createElement } from 'react';

export function $$styled(
  Comp: any,
  styles: ((options?: any) => string) & {
    variants: Array<string>;
  }
) {
  function StyledComponent(props: any) {
    const allVariants = StyledComponent.variants;
    const [variants, others] = useMemo(() => {
      const [classes, others]: any[] = [{}, {}];

      for (const [key, value] of Object.entries(props)) {
        if (allVariants.includes(key)) {
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

    if (typeof Comp === 'string') {
      return createElement(Comp, { ...others, className });
    }

    return createElement(Comp, { ...props, className });
  }

  StyledComponent.displayName = `Macaron(${Comp})`;
  StyledComponent.toString = () => StyledComponent.selector(null);
  StyledComponent.variants = [
    ...(styles.variants ?? []),
    ...(Comp.variants ?? []),
  ];
  StyledComponent.classes = (variants: any, merge?: string) => {
    const classes = new Set(
      classNames(styles({ ...variants }) + (merge ? ` ${merge}` : ''))
    );

    if (Comp.classes) {
      for (const c of Comp.classes({ ...variants }) as string[]) {
        classes.add(c);
      }
    }

    return Array.from(classes);
  };
  StyledComponent.selector = (variants: any) => {
    const classes = StyledComponent.classes(variants);

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
