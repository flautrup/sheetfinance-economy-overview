import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-tertiary": "#ffffff",
        "tertiary-fixed-dim": "#ffb3af",
        "on-primary-fixed": "#002114",
        "on-tertiary-fixed-variant": "#842225",
        "surface": "#f7f9fb",
        "tertiary-fixed": "#ffdad7",
        "error-container": "#ffdad6",
        "inverse-surface": "#2d3133",
        "secondary": "#515f74",
        "on-tertiary-container": "#711419",
        "secondary-fixed-dim": "#b9c7df",
        "on-surface": "#191c1e",
        "outline": "#6c7a71",
        "primary-fixed-dim": "#68dba9",
        "tertiary": "#a43a3a",
        "surface-tint": "#006c4a",
        "on-secondary": "#ffffff",
        "primary-container": "#3fb687",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "surface-dim": "#d8dadc",
        "on-primary-container": "#00422c",
        "surface-variant": "#e0e3e5",
        "on-secondary-container": "#57657a",
        "surface-container-high": "#e6e8ea",
        "on-tertiary-fixed": "#410005",
        "on-secondary-fixed": "#0d1c2e",
        "background": "#f7f9fb",
        "inverse-primary": "#68dba9",
        "on-primary-fixed-variant": "#005137",
        "surface-container-low": "#f2f4f6",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#bbcabf",
        "primary-fixed": "#85f8c4",
        "surface-container-highest": "#e0e3e5",
        "error": "#ba1a1a",
        "tertiary-container": "#fc7c78",
        "on-primary": "#ffffff",
        "surface-container": "#eceef0",
        "on-background": "#191c1e",
        "inverse-on-surface": "#eff1f3",
        "on-secondary-fixed-variant": "#3a485b",
        "primary": "#006c4a",
        "on-surface-variant": "#3c4a42",
        "secondary-container": "#d5e3fc",
        "secondary-fixed": "#d5e3fc",
        "surface-bright": "#f7f9fb"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["var(--font-manrope)", "sans-serif"],
        "body": ["var(--font-inter)", "sans-serif"],
        "label": ["var(--font-inter)", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
