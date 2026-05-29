/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fl: {
          red: "#E24B4A",
          "red-dark": "#A32D2D",
          bg: "#0a0a0a",
          bg2: "#111111",
          bg3: "#1a1a1a",
          bg4: "#222222",
          text: "#f0f0f0",
          muted: "#888888",
          border: "#2a2a2a",
          green: "#639922",
          amber: "#BA7517"
        }
      },
      fontFamily: {
        syne: ["var(--font-syne)", "Syne", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"]
      }
    }
  },
  plugins: []
};
