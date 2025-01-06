import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

const clientBuild = {
  ssr: false,
  manifest: true,
  outDir: "dist/client",
  rollupOptions: {
    input: {
      client: path.resolve(__dirname, "./src/client/main.tsx"),
    },
    output: {
      entryFileNames: "assets/[name]-[hash].js",
      chunkFileNames: "assets/[name]-[hash].js",
      assetFileNames: (assetInfo) => {
        if (assetInfo.name && /\.css$/.test(assetInfo.name)) {
          return "assets/styles-[hash].css";
        }
        return "assets/[name]-[hash][extname]";
      },
      manualChunks(id) {
        if (
          /node_modules\/react\//.test(id) ||
          /node_modules\/react-dom\//.test(id) ||
          /node_modules\/scheduler\//.test(id)
        ) {
          return "vendor-react";
        }
        if (id.includes("@radix-ui")) {
          return "vendor-radix";
        }
        if (id.includes("@floating-ui")) {
          return "vendor-floating";
        }
        if (id.includes("embla")) {
          return "vendor-carousel";
        }
      },
    },
  },
  cssCodeSplit: false,
};

const serverBuild = {
  ssr: true,
  manifest: false,
  outDir: "dist/server",
  rollupOptions: {
    input: {
      server: path.resolve(__dirname, "./src/index.ts"),
    },
    output: {
      entryFileNames: "assets/[name]-[hash].js",
      chunkFileNames: "assets/[name]-[hash].js",
    },
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "node:*",
      "path",
      "fs",
      "util",
      "stream",
      "http",
      "url",
      "crypto",
      "os",
      "events",
    ],
  },
};

const isServerBuild = (mode: string) => mode === "server";

export default defineConfig(({ mode }) => {
  const isBuildingServer = isServerBuild(mode);

  return {
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
    build: isBuildingServer ? serverBuild : clientBuild,
    css: {
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCase",
        generateScopedName: "[name]__[local]__[hash:base64:5]",
      },
      devSourcemap: true,
    },
    server: {
      origin: "http://127.0.0.1:4001",
      hmr: {
        overlay: true,
      },
    },
  };
});
