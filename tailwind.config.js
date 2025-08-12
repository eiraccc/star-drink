/** @type {import('tailwindcss').Config} */
import lineClamp from '@tailwindcss/line-clamp'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          ice: 'rgb(var(--color-primary-ice-rgb) / <alpha-value>)',
          sugar: 'rgb(var(--color-primary-sugar-rgb) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          ice: 'var(--color-secondary-ice)',
          sugar: 'var(--color-secondary-sugar)'
        },
        highlight: {
          DEFAULT: 'var(--color-highlight)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          ice: 'var(--color-text-ice)',
          sugar: 'var(--color-text-sugar)'
        },
        background: {
          DEFAULT: 'var(--color-background)',
        },
        contrast: {
          DEFAULT: 'var(--color-contrast)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          light: 'var(--color-surface-light)'
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
  safelist: [
    'bg-primary-sugar/20',
    'bg-primary-sugar/40',
    'bg-primary-sugar/60',
    'bg-primary-sugar/80',
    'bg-primary-sugar/100',
    'bg-primary-ice/20',
    'bg-primary-ice/40',
    'bg-primary-ice/60',
    'bg-primary-ice/80',
    'bg-primary-ice/100'
  ],
  plugins: [lineClamp],
}

