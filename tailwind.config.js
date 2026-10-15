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
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          'surface-hover': 'var(--bg-surface-hover)',
        },
        border: {
          token: 'var(--border-color)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        profit: {
          DEFAULT: 'var(--color-profit)',
          bg: 'var(--color-profit-bg)',
        },
        loss: {
          DEFAULT: 'var(--color-loss)',
          bg: 'var(--color-loss-bg)',
        },
        accent: {
          gold: 'var(--color-accent-gold)',
          'gold-bg': 'var(--color-accent-gold-bg)',
          'gold-glow': 'var(--color-accent-gold-glow)',
        },
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        page: '1200px',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        'gold-glow': '0 0 16px var(--color-accent-gold-glow)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
      },
    },
  },
  plugins: [],
};
