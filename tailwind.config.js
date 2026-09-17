/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        liven: {
          green: '#5ca701',
          greenHover: '#4e8f00',
          greenSoft: '#edf8e1',
          dark: '#1b2932',
          gray: '#486d84',
          grayLight: '#f4f7f9',
          border: '#e6edf2',
        },
        ink: {
          DEFAULT: '#1b2932',
          gray: '#486d84',
          muted: '#64748b',
          dim: '#94a3b8',
        },
        cobalt: {
          DEFAULT: '#0284c7',
          dark: '#0369a1',
          soft: '#e0f2fe',
        },
        emerald: {
          DEFAULT: '#5ca701',
          dark: '#4e8f00',
          soft: '#edf8e1',
          border: 'rgba(92, 167, 1, 0.25)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'liven-pill': '0 14px 40px rgba(0,0,0,0.08)',
        'liven-btn': '0 4px 16px rgba(92, 167, 1, 0.38)',
        'liven-card': '0 18px 50px rgba(17, 41, 60, 0.08)',
        'liven-subtle': '0 4px 20px -2px rgba(27, 41, 50, 0.05), 0 2px 6px -1px rgba(27, 41, 50, 0.03)',
      },
      borderRadius: {
        '4xl': '44px',
        '3xl': '34px',
        '2xl': '26px',
        'xl': '20px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
