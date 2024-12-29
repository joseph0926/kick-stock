/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "./node_modules/@kickstock/ui/**/*.{ts,tsx}",
  ],
  presets: [require("@kickstock/shared/tailwind.config.js")],
};
