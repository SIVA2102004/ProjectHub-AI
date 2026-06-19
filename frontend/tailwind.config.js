/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        dark: '#0F172A',
        light: '#F8FAFC',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      },
    },
  },
  plugins: [],
}
