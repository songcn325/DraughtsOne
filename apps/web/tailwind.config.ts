import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2a6900",
        "primary-dim": "#235b00",
        "primary-fixed": "#84fb42",
        "primary-fixed-dim": "#76ec33",
        secondary: "#725800",
        "secondary-fixed": "#ffcb2a",
        "secondary-dim": "#644c00",
        tertiary: "#00628c",
        "tertiary-dim": "#00557a",
        "tertiary-fixed": "#3ebbff",
        surface: "#f6f6f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f1f1",
        "surface-container": "#e7e8e8",
        "surface-container-high": "#e1e3e3",
        "surface-container-highest": "#dbdddd",
        "on-surface": "#2d2f2f",
        "on-surface-variant": "#5a5c5c",
        outline: "#767777",
        "outline-variant": "#acadad",
        error: "#b02500"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.5rem",
        xl: "0.5rem",
        full: "9999px"
      },
      fontFamily: {
        body: ["Plus Jakarta Sans", "sans-serif"],
        headline: ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
