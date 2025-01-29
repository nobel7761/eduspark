import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111827",
        logoColor: "#1A4958",
      },
      keyframes: {
        "circle-draw": {
          "0%": {
            strokeDasharray: "1, 150",
            strokeDashoffset: "0",
          },
          "100%": {
            strokeDasharray: "90, 150",
            strokeDashoffset: "-124",
          },
        },
        "check-draw": {
          "0%": {
            height: "0",
            width: "0",
            opacity: "0",
          },
          "50%": {
            height: "24px",
            width: "0",
            opacity: "1",
          },
          "100%": {
            height: "24px",
            width: "12px",
            opacity: "1",
          },
        },
      },
      animation: {
        "circle-draw": "circle-draw 0.6s ease-in-out forwards",
        check: "check-draw 0.3s ease-in-out 0.6s forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
