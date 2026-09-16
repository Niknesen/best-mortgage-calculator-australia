/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0f172a',
          gray: '#334155',
          muted: '#64748b',
          dim: '#94a3b8',
        },
        cobalt: {
          DEFAULT: '#0071e3',
          dark: '#0077ed',
          soft: '#f0f9ff',
          border: 'rgba(0, 113, 227, 0.2)',
        },
        emerald: {
          DEFAULT: '#059669',
          dark: '#047857',
          soft: '#ecfdf5',
          border: 'rgba(5, 150, 105, 0.25)',
        },
        gold: {
          DEFAULT: '#d97706',
          soft: '#fffbeb',
          border: '#fde68a',
        },
        navy: {
          dark: '#0a192f',
          btn: '#0f1e36',
          header: '#0e1626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
