/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        cream:  { DEFAULT: "#F8F5F0", 50: "#FDFCFB", 100: "#F8F5F0", 200: "#EDE8E0" },
        amber:  { DEFAULT: "#D4A030", dark: "#B8881A", light: "#E8BF6A", muted: "#FBF3DC" },
        sage:   { DEFAULT: "#7B9E87", light: "#B5CDB9", dark: "#5A7A64", muted: "#EBF2EC" },
        stone:  { 50: "#FAF9F7", 100: "#F2EDE8", 200: "#E4DDD5", 300: "#C9BFB5", 400: "#A99B8E", 500: "#8A7B6E", 600: "#6B5E52", 700: "#52473C", 800: "#3A3028", 900: "#221C17" },
        clay:   { DEFAULT: "#C4896A", light: "#E8C4B0", dark: "#A06848", muted: "#F5EDE7" },
        ink:    "#1A1714",
      },
      boxShadow: {
        card:    "0 2px 12px 0 rgba(30,20,10,0.06)",
        lift:    "0 8px 32px 0 rgba(30,20,10,0.10)",
        navbar:  "0 1px 0 0 #E4DDD5",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in":   "fadeIn 0.45s ease-out both",
        "slide-up":  "slideUp 0.4s ease-out both",
        "spin-slow": "spin 1.4s linear infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
