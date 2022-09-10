import { styled, StyleVariants } from "@macaron-css/react";
import { style } from "@macaron-css/core";
import { Button, color, fontFamily } from "./Button";

function App() {
  return (
    <div className={style({ color, fontFamily })}>
      <p>Hello World!</p>
      <Button color="neutral" size="small">
        Click Me
      </Button>
      <Button color="brand" size="medium">
        Click Me
      </Button>
      <Button color="accent" size="large">
        Click Me
      </Button>
      <Button rounded="true" size="small">
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
