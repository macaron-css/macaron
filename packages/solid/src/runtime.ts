import { createComponent, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function $$styled(
  component: any,
  styles: ((options?: any) => string) & {
    variants: Array<string>;
  }
) {
  function StyledComponent(props: any) {
    const [classes, others] = splitProps(props, [
      ...(styles.variants || []),
      ...(component.variants || []),
    ]);

    return createComponent(
      Dynamic as any,
      mergeProps(others, {
        component,
        get ['class']() {
          let className = styles(classes);

          if (props.class) {
            className += ` ${props.class}`;
          }

          return className;
        },
      })
    );
  }

  StyledComponent.toString = () => mergeSelector(styles());
  StyledComponent.variants = styles.variants;
  StyledComponent.selector = (variants: any) => mergeSelector(styles(variants));

  return StyledComponent;
}

function mergeSelector(className: string) {
  const classes = className.split(' ');

  if (classes.length == 0) {
    return '';
  }

  return '.' + classes.join('.');
}
