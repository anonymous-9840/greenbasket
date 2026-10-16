/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#14532d',
          900: '#064e3b',
          950: '#022c22',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f3ebd8',
          300: '#e8d9b8',
        },
        citrus: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(6, 78, 59, 0.07), 0 4px 12px -2px rgba(6, 78, 59, 0.04)',
        'glow': '0 12px 32px -4px rgba(22, 163, 74, 0.25)',
      }
    },
  },
  plugins: [],
}
