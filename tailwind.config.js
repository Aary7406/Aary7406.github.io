// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ctp': {
          // Catppuccin Macchiato palette
          'rosewater': '#f4dbd6',
          'flamingo': '#f0c6c6',
          'pink': '#f5bde6',
          'mauve': '#c6a0f6',
          'red': '#ed8796',
          'maroon': '#ee99a0',
          'peach': '#f5a97f',
          'yellow': '#eed49f',
          'green': '#a6da95',
          'teal': '#8bd5ca',
          'sky': '#91d7e3',
          'sapphire': '#7dc4e4',
          'blue': '#8aadf4',
          'lavender': '#b7bdf8',
          'text': '#cad3f5',
          'subtext1': '#b8c0e0',
          'subtext0': '#a5adcb',
          'overlay2': '#939ab7',
          'overlay1': '#8087a2',
          'overlay0': '#6e738d',
          'surface2': '#5b6078',
          'surface1': '#494d64',
          'surface0': '#363a4f',
          'base': '#24273a',
          'mantle': '#1e2030',
          'crust': '#181926',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'display': ['Clash Display', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};