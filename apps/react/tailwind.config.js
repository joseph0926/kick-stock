/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/**/*.{ts,tsx}",
    "../ssr/client/**/*.{ts,tsx}",
    "./node_modules/@kickstock/ssr/**/*.{ts,tsx}",
  ],
  presets: [require("@kickstock/shared/tailwind.config.js")],
};
