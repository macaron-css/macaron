import { createComponent, createMemo, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function $$styled(
  Comp: any,
  styles: ((options?: any) => string) & {
    variants: Array<string>;
  }
) {
  function StyledComponent(props: any) {
    const [variants, others] = splitProps(props, StyledComponent.variants);

    if (typeof Comp === 'string') {
      // debugger;
      return createComponent(
        Dynamic as any,
        mergeProps(others, {
          component: Comp,
          get ['class']() {
            const classes = StyledComponent.classes(variants, props.class);
            debugger;
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
          debugger;
          return classes.join(' ');
        },
      })
    );
  }

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
