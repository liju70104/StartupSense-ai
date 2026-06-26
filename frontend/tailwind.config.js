/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#2563eb",
          cyan: "#38bdf8",
          violet: "#8b5cf6",
          dark: "#070b18",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(56,189,248,0.25)",
      },
    },
  },
  plugins: [],
}