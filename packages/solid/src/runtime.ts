import { createComponent, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function $$styled(
  component: any,
  styles: ((_: any) => string) & { variants: string[] }
) {
  function StyledComponent(props: any) {
    const [classes, others] = splitProps(props, [
      ...styles.variants,
      component.variants,
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

  StyledComponent.toString = () => `Styled(${component})`;
  StyledComponent.variants = styles.variants;

  return StyledComponent;
}
