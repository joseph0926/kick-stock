import { Config } from "tailwindcss";
import baseConfig from "@kickstock/shared/tailwind.config";

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "./node_modules/@kickstock/ui/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;
