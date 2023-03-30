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

                "t-alternative-700": "rgb(32,41,58)",

/*                // More violet indigo:
                "indigo-50": "rgb(241 238 255)",
                "indigo-100": "rgb(230 224 255)",
                "indigo-200": "rgb(211 199 254)",
                "indigo-300": "rgb(186 165 252)",
                "indigo-400": "rgb(157 129 248)",
                "indigo-500": "rgb(133 102 241)",
                "indigo-600": "rgb(107 70 229)",
                "indigo-700": "rgb(85 56 202)",
                "indigo-800": "rgb(70 48 163)",
                "indigo-900": "rgb(62 46 129)"*/

                // Only a bit more violet indigo:
                "indigo-50": "rgb(240, 241, 255)",
                "indigo-100": "rgb(226, 226, 255)",
                "indigo-200": "rgb(201, 199, 254)",
                "indigo-300": "rgb(177, 165, 252)",
                "indigo-400": "rgb(147, 129, 248)",
                "indigo-500": "rgb(122, 102, 241)",
                "indigo-600": "rgb(97, 70, 229)",
                "indigo-700": "rgb(77, 56, 202)",
                "indigo-800": "rgb(63, 48, 163)",
                "indigo-900": "rgb(56, 46, 129)",

                "bgcolor": "#0f1524",
            },
        },
    },
}