import { createComponent, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function $$styled(component: any, styles = (_: any) => ({})) {
  return function StyledComponent(props: any) {
    // TODO: split props into variants and rest
    // waiting for https://github.com/seek-oss/vanilla-extract/pull/712
    // to get resolved

    // const [classes, others] = splitProps(props, ['variants']);

    return createComponent(
      Dynamic as any,
      mergeProps(
        {
          component,
          get ['class']() {
            let className = styles(props);

            if (props.class) {
              className += ` ${props.class}`;
            }

            return className;
          },
        },
        props
      )
    );
  };
}
