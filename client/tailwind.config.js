/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 make sure React files are included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
