import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "stats/index.html",
    }),
    compression(),
  ],
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
      treeshake: {
        moduleSideEffects: true, // 사이드 이펙트 처리
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  },
});
