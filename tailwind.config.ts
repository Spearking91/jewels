// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    // ... other paths
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        greatVibes: ["var(--font-great-vibes)", "cursive"], // <-- Add this line
      },
    },
  },
  plugins: [],
};