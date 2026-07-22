/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // bleu principal
        secondary: '#0a0a23', // bleu foncé
        accent: '#fbbf24', // jaune accent
        dark: '#171717',
        light: '#ededed',
      },
      fontFamily: {
        sans: ['Geist', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
