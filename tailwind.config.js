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
          card: 'var(--bg-card)',
        },
        border: {
          token: 'var(--border-color)',
          glow: 'var(--border-color-glow)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        profit: {
          DEFAULT: 'var(--color-profit)',
          bg: 'var(--color-profit-bg)',
          glow: 'var(--color-profit-glow)',
        },
        loss: {
          DEFAULT: 'var(--color-loss)',
          bg: 'var(--color-loss-bg)',
          glow: 'var(--color-loss-glow)',
        },
        accent: {
          primary: 'var(--color-accent-primary)',
          'primary-bg': 'var(--color-accent-primary-bg)',
          'primary-glow': 'var(--color-accent-primary-glow)',
          secondary: 'var(--color-accent-secondary)',
          'secondary-bg': 'var(--color-accent-secondary-bg)',
          gold: 'var(--color-accent-gold)',
          'gold-bg': 'var(--color-accent-gold-bg)',
          'gold-glow': 'var(--color-accent-gold-glow)',
        },
        metal: {
          gold: 'var(--color-metal-gold)',
          'gold-bg': 'var(--color-metal-gold-bg)',
          silver: 'var(--color-metal-silver)',
          'silver-bg': 'var(--color-metal-silver-bg)',
          platinum: 'var(--color-metal-platinum)',
          'platinum-bg': 'var(--color-metal-platinum-bg)',
          copper: 'var(--color-metal-copper)',
          'copper-bg': 'var(--color-metal-copper-bg)',
        },
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        page: '1280px',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        glass: 'var(--shadow-glass)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'gold-glow': 'var(--shadow-glow-gold)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
      },
    },
  },
  plugins: [],
};
