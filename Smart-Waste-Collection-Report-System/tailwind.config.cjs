/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        eco: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        ink: "#0f1f16",
        cream: "#fbfcf8",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Urbanist", "system-ui", "sans-serif"],
        display: ["Outfit", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(15,31,22,0.06), 0 1px 3px rgba(15,31,22,0.04)',
        'premium-lg': '0 24px 64px rgba(15,31,22,0.10), 0 8px 24px rgba(15,31,22,0.06)',
        'float': '0 16px 40px rgba(15,31,22,0.12)',
      }
    },
  },
  plugins: [],
};
