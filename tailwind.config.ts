import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: {
        base: "#0A0B0E",
        surface: "#111318",
        elevated: "#181B22",
      },
      border: {
        subtle: "#1F232C",
        strong: "#2A2F3A",
      },
      text: {
        primary: "#F5F5F7",
        muted: "#8A8F9B",
        faint: "#4A4F5A",
      },
      accent: {
        amber: "#F5B800",
      },
      data: {
        waste: "#E5484D",
        save: "#2BD17E",
      },
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    fontSize: {
      display: [
        "72px",
        { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "600" },
      ],
      headline: [
        "40px",
        { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "600" },
      ],
      title: [
        "24px",
        { lineHeight: "1.2", letterSpacing: "-0.005em", fontWeight: "600" },
      ],
      body: [
        "15px",
        { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
      ],
      label: [
        "12px",
        { lineHeight: "1.3", letterSpacing: "0.06em", fontWeight: "500" },
      ],
      micro: [
        "11px",
        { lineHeight: "1.3", letterSpacing: "0", fontWeight: "500" },
      ],
    },
    borderRadius: {
      none: "0",
      sm: "4px",
      md: "6px",
      lg: "8px",
      full: "9999px",
    },
    extend: {
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "card-in": "card-in 240ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
