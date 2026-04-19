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
        brand: {
          blue: "#3B82F6",
          "blue-light": "#EFF6FF",
          "blue-mid": "#BFDBFE",
          gray: "#F5F5F7",
          "gray-mid": "#E5E7EB",
          "gray-dark": "#6B7280",
          text: "#111827",
          "text-soft": "#374151",
        },
        amazon: "#FF9900",
        rakuten: "#BF0000",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Hiragino Sans"',
          '"Yu Gothic UI"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
