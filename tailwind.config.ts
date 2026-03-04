import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bp: {
          pink: '#FF6EC7',
          purple: '#7B61FF',
          cyan: '#00D1FF',
          yellow: '#FFD93D',
          mint: '#00FF9D',
          orange: '#FF7A00',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FF6EC7 0%, #7B61FF 50%, #00D1FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,110,199,0.1) 0%, rgba(123,97,255,0.1) 100%)',
        'passport-cover': 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'stamp': 'stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        stamp: {
          '0%': { transform: 'scale(3) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow-pink': '0 0 30px rgba(255, 110, 199, 0.4)',
        'glow-purple': '0 0 30px rgba(123, 97, 255, 0.4)',
        'glow-cyan': '0 0 30px rgba(0, 209, 255, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.16)',
        'stamp': '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
