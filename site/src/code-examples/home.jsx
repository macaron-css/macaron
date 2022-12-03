const Button = styled('button', {
  base: {
    borderRadius: 6,
  },
  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      accent: { background: 'slateblue' },
    },
    rounded: {
      true: { borderRadius: 999 },
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'neutral',
        rounded: true,
      },
      style: { background: 'ghostwhite' },
    },
  ],
  defaultVariants: {
    color: 'accent',
  },
});

<Button color="neutral" rounded>
  Click me
</Button>;
