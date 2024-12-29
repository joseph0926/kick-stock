import { Config } from "tailwindcss";
import baseConfig from "@kickstock/shared/tailwind.config";

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../web/src/**/*.{ts,tsx}",
    "./node_modules/@kickstock/web/**/*.{ts,tsx}",
    "../../packages/core/src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;
