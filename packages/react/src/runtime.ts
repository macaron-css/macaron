// import { Dynamic } from 'solid-js/web';
import { useMemo, createElement } from 'react';

export function $$styled(
  component: any,
  styles: ((options?: any) => string) & {
    variants: Array<string>;
  }
) {
  function StyledComponent(props: any) {
    const allVariants = [
      ...(styles.variants || []),
      ...(component.variants || []),
    ];
    const [classes, others] = useMemo(() => {
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
      let className = styles(classes);

      if (props.className) {
        className += ` ${props.className}`;
      }

      return className;
    }, [classes, props.className]);

    return createElement(component, { ...others, className });
  }

  StyledComponent.toString = () => mergeSelector(styles());
  StyledComponent.displayName = `Macaron(${component})`;
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
