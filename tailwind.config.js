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
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
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

