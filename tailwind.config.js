/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "t-blue-1000": "#0e1423",
        "t-blue-800": "#111b2f",
        "t-blue-500": "#1d2841",
        "t-blue-300": "#2a3a5a",
        "t-blue-100": "#3b4d7a",
      },
    },
  },
  plugins: [],
}
