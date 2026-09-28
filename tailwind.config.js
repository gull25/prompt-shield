/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#0ea5e9',
          600: '#0284c7',
          accent: '#38bdf8',
        },
        hit: {
          DEFAULT: '#10b981',
          light: '#34d399',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        miss: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
        surface: {
          dark: '#0b0f17',
          card: '#111726',
          cardHover: '#161f33',
          border: '#1e293b',
          subtle: '#0f172a'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -4px rgba(14, 165, 233, 0.25)',
        'glow-emerald': '0 0 20px -4px rgba(16, 185, 129, 0.3)',
      }
    }
  },
  plugins: [],
}
