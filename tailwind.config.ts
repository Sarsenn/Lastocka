import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        navy: {
          DEFAULT: "#162E45",
          50: "#EEF2F5",
          100: "#D6DFE7",
          200: "#AEC0CE",
          300: "#7F97AC",
          400: "#4F6E89",
          500: "#2A4A66",
          600: "#1D3A52",
          700: "#162E45",
          800: "#0F2033",
          900: "#091420",
        },
        sand: {
          DEFAULT: "#CFA779",
          50: "#FBF7F1",
          100: "#F3E8DA",
          200: "#E7D2B5",
          300: "#DBBB91",
          400: "#CFA779",
          500: "#BC8E58",
          600: "#9C7245",
          700: "#795739",
          800: "#523B27",
        },
        mist: {
          DEFAULT: "#CFCFEA",
          50: "#F7F7FC",
          100: "#EDEDF7",
          200: "#DFDFF0",
          300: "#CFCFEA",
          400: "#B3B3D9",
        },
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      maxWidth: {
        wrap: "1240px",
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(207,207,234,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(207,207,234,0.09) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        draw: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.12) translate3d(-1%,-1%,0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
