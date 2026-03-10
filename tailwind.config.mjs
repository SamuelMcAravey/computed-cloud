/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,ts,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--cc-bg) / <alpha-value>)",
        surface: "rgb(var(--cc-surface) / <alpha-value>)",
        text: "rgb(var(--cc-text) / <alpha-value>)",
        muted: "rgb(var(--cc-muted) / <alpha-value>)",
        border: "rgb(var(--cc-border) / <alpha-value>)",
        primary: "rgb(var(--cc-primary) / <alpha-value>)",
        primaryHover: "rgb(var(--cc-primaryHover) / <alpha-value>)",
        accent: "rgb(var(--cc-accent) / <alpha-value>)",
        codeAccent: "rgb(var(--cc-codeAccent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--cc-font-sans)"],
        heading: ["var(--cc-font-heading)"],
        mono: ["var(--cc-font-mono)"],
      },
      boxShadow: {
        card: "0 12px 30px -20px rgb(15 23 42 / 0.35)",
      },
    },
  },
  plugins: [],
};
