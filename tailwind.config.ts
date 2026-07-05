import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        w: {
          bg: '#fcfcfc',
          'bg-secondary': '#f6f4ef',
          'bg-tertiary': '#efece6',
          card: '#ffffff',
          'card-hover': '#f6f4ef',
          surface: '#efece6',
          cream: '#1b1a18',
          'cream-80': '#1b1a18cc',
          'cream-60': '#1b1a1899',
          'cream-50': '#1b1a1880',
          'cream-30': '#1b1a184d',
          'cream-20': '#1b1a1833',
          'cream-10': '#1b1a181a',
          'cream-5': '#1b1a180d',
          text: '#56544e',
          muted: '#6f6c66',
          faint: '#928e86',
          dim: '#bdb9b0',
          border: '#e7e3dc',
          'border-light': '#dad5cc',
          green: '#1a8f3c',
          'green-light': '#1a8f3c',
          'green-dim': '#1a8f3c1a',
          teal: '#cbb0f7',
          blue: '#2f6fed',
          warm: '#d97757',
        },
        accent: {
          DEFAULT: '#7c3aed',
          lav: '#cbb0f7',
          terra: '#d97757',
          soft: '#7c3aed1a',
        },
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'gradient-x': 'gradient-x 6s ease infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 28s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
