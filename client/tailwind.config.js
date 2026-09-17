/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFBF9',
          100: '#F7F5F0',
          200: '#EFECE4',
          300: '#E5E0D5',
        },
        charcoal: {
          900: '#18191B',
          800: '#27282B',
          700: '#3F4145',
          600: '#5C5F65',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE7E0',
          500: '#F25C3B',
          600: '#E04524',
          700: '#C23214',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
