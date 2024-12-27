import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@kickstock/ui": path.resolve(__dirname, "../../packages/ui"),
      "@kickstock/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@kickstock/router": path.resolve(__dirname, "../../packages/router/src"),
    },
  },
  server: {
    proxy: {
      "/cdn": {
        target:
          "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "js/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
