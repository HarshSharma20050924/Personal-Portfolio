
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], // Added for Freelance Template
        mono: ['JetBrains Mono', 'monospace'], // Added for technical feel
      },
      colors: {
        text: 'hsl(0, 0%, 7%)',
        background: 'hsl(0, 0%, 100%)',
        primary: 'hsl(212, 100%, 50%)',
        secondary: 'hsl(0, 0%, 27%)',
        'off-white': 'hsl(0, 0%, 97%)',

        dark: {
          text: 'hsl(0, 0%, 93%)',
          background: 'hsl(0, 0%, 7%)',
          primary: 'hsl(212, 100%, 60%)',
          secondary: 'hsl(0, 0%, 73%)',
          'off-black': 'hsl(0, 0%, 10%)',
        },

        // Elite / Freelance Theme Colors
        blue: {
          50: '#F0F6FF',
          100: '#E1EDFF',
          200: '#C3DBFF',
          300: '#94BEFF',
          400: '#5C96FF',
          500: '#4388F5',
          600: '#2B66FF',
          700: '#1E51E1',
          800: '#1D45B5',
          900: '#1D3D8E',
          950: '#162657',
        },
        elite: {
          bg: '#0D0D0D',
          sub: '#A1A1AA', // Zinc 400
          accent: '#4388F5', 
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -15px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 10px 30px -15px rgba(0, 119, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
