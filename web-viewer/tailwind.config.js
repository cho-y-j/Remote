/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#4A90D9',
          600: '#2E6BB0',
          700: '#1d5a99',
          800: '#1c4b7e',
          900: '#1c4068',
        },
      },
    },
  },
  plugins: [],
}
