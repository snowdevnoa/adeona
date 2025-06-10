// postcss.config.mjs
/** @type {import('tailwindcss').Config} */ // This JSDoc is optional but good for IDE hints
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Tailwind CSS v4 plugin
    autoprefixer: {},           // Autoprefixer plugin
  },
};