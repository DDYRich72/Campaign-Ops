import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Editorial paper-and-ink palette. Surface tokens are the canonical
        // names; slate/violet/cyan/etc. are remapped so legacy classes inherit.
        paper:    '#F4F0E6',
        card:     '#FBF8F1',
        ink:      '#1A1A1A',
        'ink-soft':  '#5A5A5A',
        'ink-faint': '#8A8A8A',
        rule:      '#E5E0D5',
        'rule-soft': '#EFEAE0',
        oxblood: {
          DEFAULT: '#7A2A2A',
          deep:    '#5A1F1F',
          soft:    '#A33A3A',
          tint:    '#F2E6E2',
        },

        surface: {
          body:    '#F4F0E6',
          sidebar: '#EEE8DC',
          card:    '#FBF8F1',
          raised:  '#F8F4EA',
        },
        border: {
          subtle:  '#EFEAE0',
          DEFAULT: '#E5E0D5',
          bright:  '#D4CDBE',
        },

        // Legacy tokens remapped — light scale (100-300) stays light for
        // backgrounds; mid-to-high scale (200-900) maps to ink so existing
        // text-slate-200/300/400 etc. all resolve to readable ink tones.
        slate: {
          50:  '#FBF8F1',
          100: '#1A1A1A',  // ink — most uses are text headings
          200: '#1A1A1A',
          300: '#1A1A1A',
          400: '#5A5A5A',
          500: '#5A5A5A',
          600: '#8A8A8A',
          700: '#5A5A5A',
          800: '#1A1A1A',
          900: '#0F0F0F',
        },

        // Brand → oxblood. Existing violet-* / brand-* classes inherit.
        violet: {
          300: '#A33A3A',
          400: '#7A2A2A',
          500: '#7A2A2A',
          600: '#5A1F1F',
          700: '#5A1F1F',
        },
        brand: {
          400: '#A33A3A',
          500: '#7A2A2A',
          600: '#5A1F1F',
        },

        // Status colors retuned for paper — low-chroma earth tones.
        cyan: {
          400: '#3A6B7A',
          500: '#2D5868',
          600: '#234451',
        },
        emerald: {
          400: '#4A6B3F',
          500: '#3A5731',
        },
        amber: {
          400: '#A57F1F',
          500: '#8A6817',
        },
        red: {
          300: '#C25C5C',
          400: '#A33A3A',
          500: '#8B2A2A',
          600: '#6F1F1F',
        },
        sky: {
          400: '#3A6B7A',
          500: '#2D5868',
        },
        pink: {
          400: '#9A4A5C',
          500: '#7E3A4B',
        },
        blue: {
          400: '#3A4F7A',
          500: '#2D3F62',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter-tight)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)',    'ui-serif',     'Georgia',    'serif'],
        serif:   ['var(--font-fraunces)',    'ui-serif',     'Georgia',    'serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
      },
      boxShadow: {
        // Paper shadows — soft, warm, low-opacity. No glows.
        'paper-sm': '0 1px 0 rgba(26,26,26,0.04), 0 1px 2px rgba(26,26,26,0.04)',
        'paper':    '0 1px 0 rgba(26,26,26,0.04), 0 4px 14px rgba(26,26,26,0.05)',
        'paper-lg': '0 1px 0 rgba(26,26,26,0.04), 0 12px 30px rgba(26,26,26,0.08)',
        // Legacy tokens remapped to neutral paper shadows so old classes inherit.
        'glow-violet':    '0 1px 0 rgba(26,26,26,0.04), 0 4px 14px rgba(26,26,26,0.05)',
        'glow-violet-lg': '0 1px 0 rgba(26,26,26,0.04), 0 12px 30px rgba(26,26,26,0.08)',
        'glow-cyan':      '0 1px 0 rgba(26,26,26,0.04), 0 4px 14px rgba(26,26,26,0.05)',
        'glow-emerald':   '0 1px 0 rgba(26,26,26,0.04), 0 4px 14px rgba(26,26,26,0.05)',
        'glow-amber':     '0 1px 0 rgba(26,26,26,0.04), 0 4px 14px rgba(26,26,26,0.05)',
        'inner-violet':   'inset 0 0 0 1px rgba(122,42,42,0.25)',
        'card':           '0 1px 0 rgba(26,26,26,0.04), 0 4px 14px rgba(26,26,26,0.05)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Legacy keyframes kept as no-ops so any remaining references don't error.
        shimmer:    { '0%': { opacity: '1' }, '100%': { opacity: '1' } },
        glowPulse:  { '0%, 100%': { opacity: '1' }, '50%': { opacity: '1' } },
        scanline:   { '0%': { opacity: '0' }, '100%': { opacity: '0' } },
      },
      animation: {
        'fade-up':     'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer':     'none',
        'glow-pulse':  'none',
        'scanline':    'none',
      },
    },
  },
  plugins: [],
};

export default config;
