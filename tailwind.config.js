// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AMOLED Dark Mode Base
        'dark': {
          'base': '#000000',
          'surface': '#0a0a0a',
          'elevated': '#121212',
          'overlay': '#1a1a1a',
        },
        // White/Gray Scale
        'light': {
          'primary': '#ffffff',
          'secondary': '#e5e5e5',
          'tertiary': '#a3a3a3',
          'muted': '#737373',
        },
        // Pastel RGB Accents (MD3 Expressive inspired)
        'accent': {
          // Pastel Cyan/Blue
          'cyan': '#7dd3fc',
          'cyan-soft': '#a5f3fc',
          'cyan-muted': '#67e8f9',
          // Pastel Magenta/Pink
          'magenta': '#f0abfc',
          'magenta-soft': '#f5d0fe',
          'magenta-muted': '#e879f9',
          // Pastel Lime/Green
          'lime': '#bef264',
          'lime-soft': '#d9f99d',
          'lime-muted': '#a3e635',
          // Pastel Red
          'red': '#fca5a5',
          'red-soft': '#fecaca',
          // Pastel Yellow
          'yellow': '#fde047',
          'yellow-soft': '#fef08a',
        },
        // Glassmorphism
        'glass': {
          'white': 'rgba(255, 255, 255, 0.08)',
          'white-hover': 'rgba(255, 255, 255, 0.12)',
          'border': 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'Inter', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Huge typography scale
        'display-xl': ['clamp(4rem, 15vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3rem, 10vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};