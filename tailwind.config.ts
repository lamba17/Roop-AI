import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080818',
        'bg-card': '#12122a',
        'bg-elevated': '#1a1a30',
        border: '#1e1e3a',
        'text-primary': '#e8e8f0',
        'text-muted': '#888888',
        purple: '#a855f7',
        pink: '#ec4899',
        gold: '#f59e0b',
        green: '#22c55e',
        cyan: '#06b6d4',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
