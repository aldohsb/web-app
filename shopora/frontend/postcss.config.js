// ============================================
// POSTCSS CONFIGURATION
// ============================================
// PostCSS adalah tool untuk transform CSS dengan JavaScript plugins
// Kita gunakan untuk Tailwind CSS dan Autoprefixer

export default {
  plugins: {
    // Tailwind CSS plugin
    // Process semua Tailwind directives (@tailwind, @apply, dll)
    tailwindcss: {},

    // Autoprefixer plugin
    // Otomatis menambahkan vendor prefixes (-webkit-, -moz-, dll)
    // untuk support browser yang lebih luas
    autoprefixer: {},
  },
};