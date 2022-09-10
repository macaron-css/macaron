import { styled } from "@macaron-css/react";

const DefaultButton = (props: { className?: string }) => (
  <button {...props} onClick={() => console.log("click")} />
);

export const color = "red";
export const fontFamily = "sans-serif";

export const Button = styled(DefaultButton, {
  base: {
    borderRadius: 4,
    border: 0,
    margin: 12,
    cursor: "pointer",
    color: "white",
    textTransform: "uppercase",
    fontSize: 12,
  },

  variants: {
    color: {
      neutral: { background: "whitesmoke", color: "#333" },
      brand: { background: "blueviolet" },
      accent: { background: "slateblue" },
    },
    size: {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 },
    },
    rounded: {
      true: { borderRadius: 999 },
    },
  },

  // Applied when multiple variants are set at once
  compoundVariants: [
    {
      variants: {
        color: "neutral",
        size: "large",
      },
      style: {
        background: "ghostwhite",
      },
    },
  ],

  defaultVariants: {
    color: "accent",
    size: "medium",
  },
});
