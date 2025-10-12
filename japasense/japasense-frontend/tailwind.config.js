/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          50: '#f6f7f4',
          100: '#e3e6dc',
          200: '#c7ccb9',
          300: '#a7af90',
          400: '#8a936d',
          500: '#6b7556',
          600: '#545d44',
          700: '#424938',
          800: '#363c30',
          900: '#2e332a',
          950: '#181b16',
        },
        bamboo: {
          50: '#f4f6f3',
          100: '#e5e9e1',
          200: '#cdd4c5',
          300: '#aab79f',
          400: '#87967a',
          500: '#6a7c5f',
          600: '#52614a',
          700: '#424d3c',
          800: '#363f33',
          900: '#2e362c',
        },
      },
      fontFamily: {
        japanese: ['Noto Sans JP', 'sans-serif'],
        main: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};