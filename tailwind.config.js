/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./player/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
