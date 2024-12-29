import {Config} from "tailwindcss"
import baseConfig from "@kickstock/shared/tailwind.config"

export default {
  content: [
    "./client/**/*.{ts,tsx}",
    "../ssr/client/**/*.{ts,tsx}",
    "./node_modules/@kickstock/ssr/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;