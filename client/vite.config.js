import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from "vite-bundle-analyzer";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(), // Run bundle analyzer only during production builds
    ...(command === "build" ? [analyzer()] : []),
  ],
}));
