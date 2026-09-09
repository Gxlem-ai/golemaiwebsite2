import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        w: {
          bg: "#fcfcfc",
          "bg-secondary": "#f6f4ef",
          "bg-tertiary": "#efece6",
          card: "#ffffff",
          "card-hover": "#f6f4ef",
          surface: "#efece6",
          cream: "#1b1a18",
          "cream-80": "#1b1a18cc",
          "cream-60": "#1b1a1899",
          "cream-50": "#1b1a1880",
          "cream-30": "#1b1a184d",
          "cream-20": "#1b1a1833",
          "cream-10": "#1b1a181a",
          "cream-5": "#1b1a180d",
          text: "#56544e",
          muted: "#6f6c66",
          faint: "#928e86",
          dim: "#bdb9b0",
          border: "#e7e3dc",
          "border-light": "#dad5cc",
          green: "#1a8f3c",
          "green-light": "#1a8f3c",
          "green-dim": "#1a8f3c1a",
          teal: "#0f9b8e",
          blue: "#2f6fed",
          warm: "#d97757",
        },
        accent: {
          DEFAULT: "#7c3aed",
          lav: "#cbb0f7",
          terra: "#d97757",
          soft: "#7c3aed1a",
        },
        /* Validated chart series (see references/palette.md procedure).
           Both clear the lightness band, chroma floor, CVD separation and 3:1 contrast
           against the #f6f4ef chart surface. */
        series: {
          1: "#7c3aed",
          2: "#c75f3d",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,26,24,0.04), 0 8px 24px -12px rgba(27,26,24,0.10)",
        lift: "0 2px 4px rgba(27,26,24,0.04), 0 24px 48px -20px rgba(27,26,24,0.20)",
        panel: "0 28px 70px -28px rgba(27,26,24,0.28)",
        glow: "0 0 40px -12px rgba(124,58,237,0.45)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        "marquee-reverse": "marquee-reverse 46s linear infinite",
        float: "float 7s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "gradient-x": "gradient-x 8s ease infinite",
        shimmer: "shimmer 2.6s linear infinite",
        "spin-slow": "spin 34s linear infinite",
        "spin-reverse": "spin-reverse 44s linear infinite",
        aurora: "aurora 22s ease-in-out infinite",
        "aurora-slow": "aurora 30s ease-in-out infinite reverse",
        "pulse-ring": "pulse-ring 2.8s cubic-bezier(0.16,1,0.3,1) infinite",
        caret: "caret 1.1s steps(1) infinite",
        "scan-y": "scan-y 5s linear infinite",
        sheen: "sheen 3.2s ease-in-out infinite",
        "bob-sm": "bob-sm 5s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bob-sm": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.7" },
          "33%": { transform: "translate3d(4%,-3%,0) scale(1.12)", opacity: "0.95" },
          "66%": { transform: "translate3d(-3%,3%,0) scale(0.95)", opacity: "0.6" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.72)", opacity: "0.7" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        caret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "scan-y": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(900%)" },
        },
        sheen: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
