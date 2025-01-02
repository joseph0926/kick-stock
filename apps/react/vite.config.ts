import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import visualizer from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ssr: true,
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "./src/index.ts"),
    },
  },
  server: {
    origin: "http://127.0.0.1:4001",
  },
});
