import {
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from '@vanilla-extract/recipes/dist/declarations/src/types';

const shouldApplyCompound = <Variants extends VariantGroups>(
  compoundCheck: VariantSelection<Variants>,
  selections: VariantSelection<Variants>,
  defaultVariants: VariantSelection<Variants>
) => {
  for (const key of Object.keys(compoundCheck)) {
    if (compoundCheck[key] !== (selections[key] ?? defaultVariants[key])) {
      return false;
    }
  }

  return true;
};

export const createRuntimeFn = <Variants extends VariantGroups>(
  config: PatternResult<Variants>
) => {
  const runtimeFn: RuntimeFn<Variants> & {
    macaronMeta: {
      variants: Array<keyof Variants>;
      defaultClassName: string;
      variantConcat: (variants: VariantSelection<Variants>) => string;
    };
  } = options => {
    let className = config.defaultClassName;

    const selections: VariantSelection<Variants> = {
      ...config.defaultVariants,
      ...options,
    };
    for (const variantName in selections) {
      const variantSelection =
        selections[variantName] ?? config.defaultVariants[variantName];

      if (variantSelection != null) {
        let selection = variantSelection;

        if (typeof selection === 'boolean') {
          // @ts-expect-error
          selection = selection === true ? 'true' : 'false';
        }

        const selectionClassName =
          // @ts-expect-error
          config.variantClassNames[variantName]?.[selection];

        if (selectionClassName) {
          className += ' ' + selectionClassName;
        }
      }
    }

    for (const [compoundCheck, compoundClassName] of config.compoundVariants) {
      if (
        shouldApplyCompound(compoundCheck, selections, config.defaultVariants)
      ) {
        className += ' ' + compoundClassName;
      }
    }

    return className;
  };

  runtimeFn.macaronMeta = {
    variants: Object.keys(config.variantClassNames),
    defaultClassName: config.defaultClassName,
    variantConcat(options) {
      let className = config.defaultClassName;

      for (const variantName in options) {
        const variantSelection = options[variantName];

        if (variantSelection != null) {
          let selection = variantSelection;

          if (typeof selection === 'boolean') {
            // @ts-expect-error
            selection = selection === true ? 'true' : 'false';
          }

          const selectionClassName =
            // @ts-expect-error
            config.variantClassNames[variantName]?.[selection];

          if (selectionClassName) {
            className += ' ' + selectionClassName;
          }
        }
      }

      return className;
    },
  };

  return runtimeFn;
};
