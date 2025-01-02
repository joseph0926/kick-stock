import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "./src/index.ts"),
    },
  },
  server: {
    origin: "http://127.0.0.1:4001",
  },
});
