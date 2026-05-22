/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#050505",
          gray: "#121212",
          border: "#1E1E1E",
          primary: "#00F0FF",
          secondary: "#7000FF",
          danger: "#FF0055",
          success: "#00FF66",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 240, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
