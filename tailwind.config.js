/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'mono': ['Roboto Mono', 'monospace'],
      "sans": ["Inter"]
    },
    extend: {
      colors: {
        "t-blue-1000": "#0e1423",
        "t-blue-800": "#111b2f",
        "t-blue-700": "#131e34",
        "t-blue-500": "#1d2841",
        "t-blue-300": "#2a3a5a",
        "t-blue-200": "#2e3f60",
        "t-blue-100": "#36496e",
        "t-blue-50": "#506793",

        "light-violet-800": "#6f5bf5",
        "light-violet-700": "#7a6cf5",
        "light-violet-500": "#8c7bf5",
        "light-violet-2OO": "#aea2f8",

        "t-alternative-700": "#262836"
      },
    },
  },
  plugins: [],
}
