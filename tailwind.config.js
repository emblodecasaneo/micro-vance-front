/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#375d81', // Bleu finance
          light: '#3B82F6',
          dark: '#1E3A8A',
          nav: '#F8FAFC',
          gray: "#6b7280"
        },
        secondary: {
          DEFAULT: '#10B981', // Vert pour croissance/profit
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#F59E0B', // Orange/Gold pour finance
          light: '#FBBF24',
          dark: '#D97706',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#F1F5F9',
        },
      },
    },
  },
  plugins: [],
} 