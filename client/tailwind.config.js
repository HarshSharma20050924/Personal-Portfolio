/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        text: '#000000',
        background: '#FFFFFF',
        primary: '#0077FF',
        secondary: '#555555',
        'off-white': '#F8F8F8',
      },
      boxShadow: {
        'soft': '0 10px 30px -15px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}