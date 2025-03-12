/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4a9eff",
        secondary: "#3a7fd9",
        dark: "#121212",
        darkgray: "#1e1e1e",
      },
    },
  },
  plugins: [],
} 