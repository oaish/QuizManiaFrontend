/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode toggle
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e1e7ff',
          200: '#c8d3ff',
          300: '#a2b4ff',
          400: '#738eff',
          500: '#4763ff', // Brand primary blue
          600: '#2c3eff',
          700: '#1d27ff',
          800: '#1920d3',
          900: '#1b1fa4',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e1e6',
          200: '#c2c2ce',
          300: '#9b9bb2',
          400: '#717192',
          500: '#4e4e75',
          600: '#3a3a5a',
          700: '#2b2b43',
          800: '#1e1e2f', // Premium slate dark primary background
          900: '#12121c', // Premium slate dark secondary background
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'glass': '16px',
      }
    },
  },
  plugins: [],
}
