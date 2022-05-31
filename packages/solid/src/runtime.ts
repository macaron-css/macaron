import { createComponent, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function $$styled(component: any, styles = (_: any) => ({})) {
  return function StyledComponent(props: any) {
    const [classes, others] = splitProps(props, ['variants']);
    return createComponent(
      Dynamic as any,
      mergeProps(
        {
          component,
          get ['class']() {
            return styles(classes.variants);
          },
        },
        others
      )
    );
  };
}
