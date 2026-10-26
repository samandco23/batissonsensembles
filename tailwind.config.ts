import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F2762E",
          dark: "#D65C17",
          soft: "#FDEADF",
        },
        ink: {
          DEFAULT: "#1E1E1E",
          soft: "#3C3C3C",
          muted: "#6E6A66",
        },
        cream: "#FDF8F3",
        sand: "#F7EEE6",
        line: "#ECE1D8",
        clay: "#B23A28",
        leaf: "#1F8A5B",
      },
      fontFamily: {
        sans: ["Poppins", "Trebuchet MS", "system-ui", "sans-serif"],
        display: ["Poppins", "Trebuchet MS", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,30,30,0.04), 0 10px 30px -18px rgba(30,30,30,0.22)",
        lift: "0 2px 4px rgba(30,30,30,0.05), 0 22px 44px -22px rgba(30,30,30,0.28)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
