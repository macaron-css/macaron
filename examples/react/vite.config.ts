import { defineConfig } from "vite";
import { macaronVitePlugin } from "@macaron-css/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), macaronVitePlugin()],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
