import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@kickstock/client": path.resolve(__dirname, "./"),
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
  ssr: {},
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "js/[name].js",
        assetFileNames: "assets/[name].[ext]",
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }

          if (id.includes("node_modules/motion")) {
            return "vendor-motion";
          }
        },
      },
    },
  },
});
