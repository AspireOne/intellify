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
        "dark-blue": "#0c111f",
        "darkish-blue": "#252e42",
        "lighter-blue": "#303c56"
      },
    },
  },
  plugins: [],
}
