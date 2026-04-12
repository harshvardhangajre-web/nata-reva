import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          900: "#0D0D0D",
          800: "#1A1A1A",
          700: "#2D2D2D",
          600: "#4A4A4A",
          400: "#8A8A8A",
          200: "#D4D4D4",
          100: "#F0EFEC",
          50: "#F8F7F4",
        },
        amber: {
          DEFAULT: "#E8A940",
          light: "#F5D08A",
          dark: "#C4882A",
        },
        sage: {
          DEFAULT: "#6B8F71",
          light: "#A8C4AB",
          dark: "#4A6B50",
        },
        coral: {
          DEFAULT: "#E07060",
          light: "#F0A898",
        },
      },
      backgroundImage: {
        "grain": "url('/grain.svg')",
      },
      boxShadow: {
        "soft": "0 2px 20px rgba(0,0,0,0.06)",
        "card": "0 4px 40px rgba(0,0,0,0.08)",
        "lift": "0 8px 60px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
