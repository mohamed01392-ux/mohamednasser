import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#193E32",
          50: "#F2F6F4",
          100: "#E3ECE8",
          200: "#C4D8CF",
          300: "#99BDB0",
          400: "#6B9C8D",
          500: "#447B6B",
          600: "#2B5E50",
          700: "#193E32", // primary forest green
          800: "#133128",
          900: "#0D221C",
          950: "#06130F",
        },
        sand: {
          DEFAULT: "#B69A70",
          50: "#FAF7F2",
          100: "#F3ECE1",
          200: "#E6D7C1",
          300: "#D6BF9E",
          400: "#C5A87F",
          500: "#B69A70", // sand gold
          600: "#9E8156",
          700: "#7E6541",
          800: "#604C31",
          900: "#433421",
        },
        ivory: {
          DEFAULT: "#F6F3EC",
          light: "#FAF8F5",
          dark: "#EDE7DC",
        },
        charcoal: {
          DEFAULT: "#232A27",
          50: "#F5F6F5",
          100: "#E6E8E7",
          200: "#CCD0CE",
          300: "#AAB0AC",
          400: "#7F8783",
          500: "#5D6561",
          600: "#444B47",
          700: "#323734",
          800: "#232A27", // primary charcoal
          900: "#171C1A",
          950: "#0C0E0D",
        },
      },
      fontFamily: {
        arabic: ["var(--font-alexandria)", "sans-serif"],
        editorial: ["var(--font-alexandria)", "serif"],
      },
      boxShadow: {
        luxury: "0 20px 40px -15px rgba(25, 62, 50, 0.08)",
        "luxury-hover": "0 25px 50px -12px rgba(25, 62, 50, 0.16)",
        card: "0 4px 20px -2px rgba(35, 42, 39, 0.05)",
        floating: "0 30px 60px rgba(25, 62, 50, 0.12)",
      },
      borderRadius: {
        luxury: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
