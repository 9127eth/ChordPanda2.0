import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fdfaeb",
        text: "#1B1B1B",
        action: "#FFB300",
        card: "#F5F5F5",
        options: "#F5F5F5",
        mainCardText: "#000000",
        altCardText: "#333333",
        websiteSection: "#E0E0E0",
        error: "#DD1C1A",
        success: "#BAD9B5",
      },
    },
  },
  plugins: [],
};
export default config;
