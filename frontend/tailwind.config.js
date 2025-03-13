module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./frontend/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-350': 'var(--neutral-350)',
        'neutral-850': 'var(--neutral-850)',
      },
    },
  },
  darkMode: 'class', // or 'media'
  plugins: [],
}