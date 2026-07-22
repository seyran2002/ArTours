/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/app.vue",
    "./app/error.vue"
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        primary: "#12534E",
        secondary: "#F89B1F",
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #fdb94a 0%, #f9a42a 50%, #e8860e 100%)',
        'brand-gradient-primary': 'linear-gradient(135deg, #1a8a78 0%, #146b5c 45%, #12534E 100%)',
      },
      boxShadow: {
        'brand': '0 4px 18px rgba(248, 155, 31, 0.30), 0 1px 5px rgba(253, 185, 74, 0.15)',
        'brand-hover': '0 8px 30px rgba(248, 155, 31, 0.40), 0 4px 12px rgba(253, 185, 74, 0.22)',
        'brand-primary': '0 4px 18px rgba(18, 83, 78, 0.25), 0 1px 5px rgba(26, 138, 120, 0.12)',
        'brand-primary-hover': '0 8px 30px rgba(18, 83, 78, 0.35), 0 4px 12px rgba(26, 138, 120, 0.18)',
      },
    },
  },
  plugins: [],
}

