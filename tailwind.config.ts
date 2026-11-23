import type { Config } from "tailwindcss";

/**
 * GOLEM design tokens.
 *
 * The palette is the brand's own: warm ink and paper neutrals, a violet accent,
 * its lavender tint, and terracotta (the clay the name comes from). Everything
 * else here is a tint or shade of those hues, plus one green for confirmations.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Switzer",
          "Switzer Fallback",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        /* Text */
        ink: {
          DEFAULT: "#1b1a18",
          soft: "#2c2a27",
        },
        copy: "#56544e",
        muted: "#6f6c66",
        faint: "#928e86",
        dim: "#bdb9b0",

        /* Surfaces */
        paper: {
          DEFAULT: "#fcfcfc",
          soft: "#f6f4ef",
          sunk: "#efece6",
          card: "#ffffff",
        },
        line: {
          DEFAULT: "#e7e3dc",
          strong: "#dad5cc",
        },
        /* Dark bands: shades of the ink, never a new hue. */
        band: {
          DEFAULT: "#151412",
          raised: "#1f1d1b",
          line: "#34312d",
        },

        /* Brand hues */
        accent: {
          DEFAULT: "#7c3aed",
          deep: "#6529d3",
          ink: "#5a23c0",
          lav: "#cbb0f7",
          tint: "#e9defc",
          wash: "#f4effe",
          soft: "#7c3aed1a",
          terra: "#d97757",
        },
        terra: {
          DEFAULT: "#d97757",
          deep: "#b24f2c",
          tint: "#f3d3c6",
          wash: "#fcf1ec",
        },
        ok: {
          DEFAULT: "#1a8f3c",
          deep: "#157a33",
          wash: "#e9f6ed",
        },

        /* Chart series, validated against the cream chart surface. */
        series: {
          1: "#7c3aed",
          2: "#c75f3d",
        },

      },
      fontSize: {
        /* Display sizes carry their own leading, tracking and weight so that a
           heading is one class, the same everywhere it appears. */
        display: ["clamp(2.25rem, 5.6vw, 5rem)", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "400" }],
        hero: ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "400" }],
        h1: ["clamp(2.125rem, 3.5vw, 3.125rem)", { lineHeight: "1.02", letterSpacing: "-0.036em", fontWeight: "500" }],
        h2: ["clamp(1.875rem, 3.4vw, 3rem)", { lineHeight: "1.04", letterSpacing: "-0.024em", fontWeight: "400" }],
        cta: ["clamp(2rem, 3.8vw, 3.375rem)", { lineHeight: "1.02", letterSpacing: "-0.037em", fontWeight: "400" }],
        h3: ["clamp(1.5rem, 2vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.04em", fontWeight: "500" }],
        h4: ["1.125rem", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "500" }],
        lead: ["1.125rem", { lineHeight: "1.45", letterSpacing: "-0.01em" }],
        para: ["1rem", { lineHeight: "1.5", letterSpacing: "-0.0125em" }],
        small: ["0.875rem", { lineHeight: "1.45", letterSpacing: "-0.005em" }],
        label: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.08em" }],
      },
      maxWidth: {
        site: "78rem",
      },
      borderRadius: {
        card: "16px",
        window: "12px",
      },
      boxShadow: {
        window: "0 1px 2px rgba(27,26,24,0.04), 0 14px 36px -18px rgba(27,26,24,0.18)",
        float: "0 1px 2px rgba(27,26,24,0.05), 0 8px 20px -10px rgba(27,26,24,0.16)",
        nav: "0 1px 0 rgba(27,26,24,0.02), 0 10px 30px -14px rgba(27,26,24,0.18)",
        form: "0 40px 80px -40px rgba(0,0,0,0.6)",
        card: "0 1px 2px rgba(27,26,24,0.04), 0 8px 24px -12px rgba(27,26,24,0.10)",
        lift: "0 2px 4px rgba(27,26,24,0.04), 0 24px 48px -20px rgba(27,26,24,0.20)",
        glow: "0 0 40px -12px rgba(124,58,237,0.45)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-soft": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      animation: {
        marquee: "marquee 52s linear infinite",
        "marquee-reverse": "marquee-reverse 52s linear infinite",
        "pulse-ring": "pulse-ring 2.8s cubic-bezier(0.16,1,0.3,1) infinite",
        caret: "caret 1.1s steps(1) infinite",
        "spin-slow": "spin 28s linear infinite",
        breathe: "breathe 3.6s ease-in-out infinite",
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
        "pulse-ring": {
          "0%": { transform: "scale(0.72)", opacity: "0.7" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        caret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
