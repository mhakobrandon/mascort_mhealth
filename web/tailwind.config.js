/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3EEFF',
          100: '#E4D4FF',
          200: '#C9AAFF',
          300: '#A97DFF',
          400: '#8B52F5',
          500: '#7B2FBE',
          600: '#6320A0',
          700: '#4D1880',
          800: '#370F60',
          900: '#220840',
        },
        green: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
