/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        /*fontFamily: {
            'mono': ['Roboto Mono', 'monospace'],
            "sans": ["Inter", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Cantarell", "Helvetica Neue"],
        },*/
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            colors: {
                "t-blue-1000": "#0e1323",
                "t-blue-900": "#121728",
                "t-blue-800": "#11182d",
                "t-blue-700": "#131b32",
                "t-blue-500": "#1d253f",
                "t-blue-300": "#2a375a",
                "t-blue-200": "#2e3b5d",
                "t-blue-100": "#364569",
                "t-blue-50": "#50628c",

                "t-violet-800": "#6A64F1",
                "t-violet-700": "#726ef3",
                "t-violet-500": "#8580f3",
                "t-violet-2OO": "#a194ee",

                "t-alternative-700": "rgb(32,41,58)"
            },
        },
    },
}