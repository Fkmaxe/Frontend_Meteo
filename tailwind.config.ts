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
        background: "var(--background)",
        foreground: "var(--foreground)",
        bordeaux: {
          DEFAULT: "#800000",
          dark: "#600000",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".dragging": {
          opacity: "0.7",
          backgroundColor: "#f0f0f0",
        },
        ".over": {
          backgroundColor: "#e0ffe0",
          border: "2px dashed #00cc00",
        },
        ".drag-overlay": {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: "1000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "24px",
          pointerEvents: "none",
        },
      });
    },
  ],
} satisfies Config;
