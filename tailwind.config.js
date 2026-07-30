/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // 暗黑主题基础色
        'bg-primary': '#0a0605',
        'bg-secondary': '#14100e',
        'bg-tertiary': '#1f1814',
        'text-primary': '#e8ddd0',
        'text-secondary': '#a89580',
        'text-muted': '#a89580',
        'text-dim': '#6b5d4f',
        'bg-card': '#14100e',
        'bg-elevated': '#1f1814',
        'accent-bronze': '#7a6b5a',
        'accent-blood': '#5c1a1a',
        'accent-gold': '#d4a373',
        // 角色主题色（由 CSS 变量动态控制）
        'theme': 'var(--color-theme)',
        'theme-dim': 'var(--color-theme-dim)',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/images/common/paper-texture.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fog-drift': 'fogDrift 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(-10%) translateY(0)' },
          '50%': { transform: 'translateX(10%) translateY(-5%)' },
          '100%': { transform: 'translateX(-10%) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
