/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/core/src/**/*.{ts,tsx}",
    "./node_modules/@kickstock/core/**/*.{ts,tsx}",
  ],
  presets: [require("@kickstock/shared/tailwind.config.js")],
};
