// ============================================
// TAILWIND CSS CONFIGURATION
// ============================================
// Konfigurasi custom untuk Tailwind CSS
// Design System untuk Shopora E-Commerce

/** @type {import('tailwindcss').Config} */
export default {
  // ============================================
  // CONTENT
  // ============================================
  // File-file yang akan di-scan oleh Tailwind untuk class usage
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Semua file JS/JSX di folder src
  ],

  // ============================================
  // THEME CUSTOMIZATION
  // ============================================
  theme: {
    extend: {
      // ============================================
      // COLORS - Elegant & Classic Theme
      // ============================================
      colors: {
        // Primary color - Warna utama brand (elegant navy blue)
        primary: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cde5',
          300: '#8cb4d8',
          400: '#669bcb',
          500: '#4a7ba7', // Main primary color
          600: '#3d6489',
          700: '#2f4d6b',
          800: '#22364d',
          900: '#14202f',
        },

        // Secondary color - Warna sekunder (warm gold)
        secondary: {
          50: '#faf8f3',
          100: '#f5f0e6',
          200: '#ebe1cd',
          300: '#e1d2b4',
          400: '#d7c39b',
          500: '#c9a961', // Main secondary color
          600: '#b8964d',
          700: '#9a7d3f',
          800: '#735d2f',
          900: '#4d3e20',
        },

        // Neutral colors - Warna netral untuk background & text
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },

        // Success color (green)
        success: {
          light: '#86efac',
          DEFAULT: '#22c55e',
          dark: '#16a34a',
        },

        // Error color (red)
        error: {
          light: '#fca5a5',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },

        // Warning color (yellow)
        warning: {
          light: '#fde047',
          DEFAULT: '#eab308',
          dark: '#ca8a04',
        },

        // Info color (blue)
        info: {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        // Font untuk heading (elegant serif)
        heading: ['Playfair Display', 'Georgia', 'serif'],
        // Font untuk body text (clean sans-serif)
        body: ['Inter', 'system-ui', 'sans-serif'],
        // Font untuk numbers/prices
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },

      fontSize: {
        // Custom font sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      // ============================================
      // SPACING
      // ============================================
      spacing: {
        // Custom spacing values
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      // ============================================
      // BOX SHADOW
      // ============================================
      boxShadow: {
        // Elegant shadows
        'elegant-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'elegant': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'elegant-xl': '0 12px 48px rgba(0, 0, 0, 0.16)',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // ============================================
      // CONTAINER
      // ============================================
      container: {
        center: true, // Center container
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },

  // ============================================
  // PLUGINS
  // ============================================
  plugins: [],
};