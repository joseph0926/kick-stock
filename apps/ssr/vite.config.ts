import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {},
  },
  build: {
    ssr: true,
    outDir: "dist-ssr",
    rollupOptions: {
      external: ["@kickstock/ssr/utils/create-request.ts"],
      input: path.resolve(__dirname, "../ssr/src/steam/index.tsx"),
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "js/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
