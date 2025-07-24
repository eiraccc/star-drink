/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          ice: 'var(--color-primary-ice)'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          ice: 'var(--color-secondary-ice)'
        },
        highlight: {
          DEFAULT: 'var(--color-highlight)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          ice: 'var(--color-text-ice)'
        },
        background: {
          DEFAULT: 'var(--color-background)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
        }
      }
    },
  },
  plugins: [],
}

