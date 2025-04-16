// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'cyber': ['"Share Tech Mono"', 'monospace'],
        },
        colors: {
          'cyber': {
            dark: '#0a0a0f',
            darker: '#050507',
            light: '#1a1a2f',
            neon: '#00ff9d',
            blue: '#0ff0fc',
            pink: '#ff00ff',
            red: '#ff003c',
            success: '#00ff9d',
            warning: '#ffb800',
            danger: '#ff003c',
          }
        },
        boxShadow: {
          'neon': '0 0 5px theme("colors.cyber.neon"), 0 0 20px theme("colors.cyber.neon")',
        },
        backgroundImage: {
          'cyber-grid': 'linear-gradient(transparent 97%, var(--grid-color) 97%), linear-gradient(90deg, transparent 97%, var(--grid-color) 97%)',
        },
      },
    },
    plugins: [],
  }
  