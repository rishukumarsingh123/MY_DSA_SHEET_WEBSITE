/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        easy: {
          light: '#10b981',
          bg: '#ecfdf5',
          text: '#047857',
          darkBg: '#064e3b',
          darkText: '#6ee7b7'
        },
        medium: {
          light: '#f59e0b',
          bg: '#fffbeb',
          text: '#b45309',
          darkBg: '#78350f',
          darkText: '#fcd34d'
        },
        hard: {
          light: '#ef4444',
          bg: '#fef2f2',
          text: '#b91c1c',
          darkBg: '#7f1d1d',
          darkText: '#fca5a5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
