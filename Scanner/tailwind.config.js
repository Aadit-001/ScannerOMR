/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'custom-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(40vw)' },
        },
      },
      animation: {
        'custom-bounce': 'custom-bounce 7s infinite',
      },
      boxShadow: {
        glow: '0 0 10px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6)',
      },
    },
  },
  plugins: [],
}


