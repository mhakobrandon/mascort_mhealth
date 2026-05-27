/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F2F9E6',
          100: '#E0F2C4',
          200: '#C4E896',
          300: '#A9DC6B',
          400: '#9DD265',
          500: '#93C962',   // brand colour
          600: '#76A44E',
          700: '#5A7D3B',
          800: '#3D5528',
          900: '#212E15',
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
