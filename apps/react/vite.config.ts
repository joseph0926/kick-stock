import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "stats/index.html",
    }),
  ],
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
      output: {
        manualChunks(id) {
          if (id.includes("@radix-ui")) {
            return "vender-radix";
          }
          if (id.includes("@floating-ui")) {
            return "vender-floating";
          }
          if (id.includes("embla")) {
            return "vender-carousel";
          }
        },
      },
    },
  },
  server: {
    origin: "http://127.0.0.1:4001",
  },
});
