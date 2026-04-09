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
        surface: {
          body:    '#07090f',
          sidebar: '#0b0e16',
          card:    '#0f1420',
          raised:  '#151c2c',
        },
        border: {
          subtle:  '#1a2035',
          DEFAULT: '#243050',
          bright:  '#344568',
        },
        violet: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        cyan: {
          400: '#67e8f9',
          500: '#22d3ee',
          600: '#06b6d4',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        brand: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
      },
      fontFamily: {
        sans:    ['var(--font-dm-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet':    '0 0 24px rgba(168, 85, 247, 0.35)',
        'glow-violet-lg': '0 0 48px rgba(168, 85, 247, 0.45)',
        'glow-cyan':      '0 0 24px rgba(34, 211, 238, 0.3)',
        'glow-emerald':   '0 0 24px rgba(16, 185, 129, 0.3)',
        'glow-amber':     '0 0 24px rgba(245, 158, 11, 0.3)',
        'inner-violet':   'inset 0 0 0 1px rgba(168, 85, 247, 0.5)',
        'card':           '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
      animation: {
        'fade-up':     'fadeUp 0.4s ease-out forwards',
        'shimmer':     'shimmer 2.5s linear infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'scanline':    'scanline 6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
