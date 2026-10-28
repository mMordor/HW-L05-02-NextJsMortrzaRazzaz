import type { Config } from "tailwindcss";

// تنظیمات تم از روی طراحی (رنگ‌ها، فونت‌ها و اندازه‌ها)
type Size = [string, { lineHeight: string; fontWeight: string; letterSpacing?: string }];
const t = (s: string, lh: string, w: string, ls?: string): Size => [
  s,
  { lineHeight: lh, fontWeight: w, ...(ls ? { letterSpacing: ls } : {}) },
];

const fontSize: Record<string, Size> = {
  "body-lg": t("18px", "28px", "400"),
  "body-md": t("15px", "24px", "400"),
  "body-sm": t("13px", "18px", "400"),
  "title-lg": t("20px", "28px", "600"),
  "title-md": t("17px", "24px", "600"),
  "label-lg": t("14px", "20px", "600", "0.01em"),
  "label-md": t("12px", "16px", "600", "0.02em"),
  "label-sm": t("11px", "14px", "700", "0.04em"),
  "headline-sm": t("22px", "28px", "600"),
  "headline-md": t("28px", "34px", "600", "-0.01em"),
  "headline-lg": t("40px", "48px", "600", "-0.015em"),
  "display-mobile": t("38px", "44px", "600", "-0.01em"),
  display: t("56px", "64px", "600", "-0.02em"),
};

const serif = ["Playfair Display", "serif"];
const sans = ["Plus Jakarta Sans", "sans-serif"];
const fontFamily = Object.fromEntries(
  Object.keys(fontSize).map((k) => [k, /^(display|headline)/.test(k) ? serif : sans])
);

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a83301",
        "primary-container": "#ca4a1c",
        "on-primary": "#ffffff",
        "primary-fixed": "#ffdbd0",
        "on-primary-fixed": "#390b00",
        secondary: "#006d30",
        "secondary-container": "#92f5a4",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#007233",
        "secondary-fixed": "#95f8a7",
        tertiary: "#994100",
        surface: "#fff8f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fff1eb",
        "surface-container": "#fbebe4",
        "surface-container-high": "#f5e5de",
        "surface-variant": "#efdfd9",
        "on-surface": "#221a16",
        "on-surface-variant": "#59413a",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "inverse-surface": "#372f2a",
        "inverse-on-surface": "#feeee7",
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        margin: "2rem",
        gutter: "1.5rem",
      },
      fontSize,
      fontFamily,
    },
  },
  plugins: [],
};
export default config;
