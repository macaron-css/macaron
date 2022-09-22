import { styled, StyleVariants } from "@macaron-css/react";
import { style } from "@macaron-css/core";

const color = "red";
const fontFamily = "sans-serif";

const Button = styled("button", {
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

function App() {
  return (
    <div className={style({ color, fontFamily })}>
      <p>Hello World!</p>
      <Button
        color="neutral"
        size="small"
        onClick={() => console.log("Clicked 1")}
      >
        Click Me
      </Button>
      <Button
        color="brand"
        size="medium"
        onClick={() => console.log("Clicked 2")}
      >
        Click Me
      </Button>
      <Button
        color="accent"
        size="large"
        onClick={() => console.log("Clicked 3")}
      >
        Click Me
      </Button>
      <Button
        rounded
        size="small"
        onClick={() => console.log("Clicked 4")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={style({ width: "1.5rem", height: "1.5rem" })}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Button>
    </div>
  );
}

export default App;
