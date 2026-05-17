/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wild': {
          'bg': '#060a0f',
          'card': '#0d1520',
          'border': '#1a2840',
          'green': '#00ff88',
          'red': '#ff3333',
          'amber': '#ffaa00',
          'blue': '#00aaff',
          'purple': '#8855ff',
        }
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'body': ['Exo 2', 'sans-serif'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slideIn': 'slideIn 0.3s ease-out',
        'fadeUp': 'fadeUp 0.5s ease-out',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 5px #00ff88' },
          '50%': { opacity: 0.5, boxShadow: '0 0 20px #00ff88, 0 0 40px #00ff88' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        glow: {
          'from': { textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88' },
          'to': { textShadow: '0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88' },
        },
        slideIn: {
          'from': { transform: 'translateX(-20px)', opacity: 0 },
          'to': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeUp: {
          'from': { transform: 'translateY(20px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
