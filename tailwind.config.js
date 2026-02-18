/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'ant-primary': 'var(--ant-primary)',
        'title-black': '#545F70',
      },
    },
  },
  plugins: [],
}
