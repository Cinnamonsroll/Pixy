import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "16": "repeat(16, minmax(0, 1fr))"
      },
      colors: {
        background: {
          50: "#f6f6f9",
          100: "#ececf2",
          200: "#d5d6e2",
          300: "#b0b2c9",
          400: "#8689aa",
          500: "#676a90",
          600: "#525577",
          700: "#434461",
          800: "#3a3c52",
          900: "#343446",
          950: "#21212d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
