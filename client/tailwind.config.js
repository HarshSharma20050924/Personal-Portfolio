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
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -15px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 10px 30px -15px rgba(0, 119, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
