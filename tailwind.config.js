/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fl: {
          accent: "#ffffff",
          "accent-dark": "#e5e5e5",
          bg: "#000000",
          bg2: "#080808",
          bg3: "#111111",
          bg4: "#1a1a1a",
          invert: "#ffffff",
          "invert-muted": "#f0f0f0",
          text: "#ffffff",
          "text-invert": "#000000",
          muted: "#888888",
          border: "#222222",
          "border-light": "#444444",
          success: "#ffffff",
          warn: "#cccccc",
          // Legacy aliases
          red: "#ffffff",
          "red-dark": "#e5e5e5",
          green: "#ffffff",
          amber: "#cccccc"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Helvetica Neue", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Instrument Serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"]
      },
      letterSpacing: {
        display: "-0.06em",
        label: "0.15em",
        caption: "0.05em"
      },
      animation: {
        "fade-up": "fl-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fl-fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "fl-marquee 10s linear infinite",
        "chaos-marquee": "fl-chaos-marquee 12s linear infinite",
        "jitter": "fl-jitter 0.3s infinite",
        "shake": "fl-shake 5s cubic-bezier(.36,.07,.19,.97) infinite",
      },
      keyframes: {
        "fl-fade-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "fl-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "fl-marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        "fl-chaos-marquee": {
          "0%": { transform: "translateX(0) rotate(-2deg)" },
          "50%": { transform: "translateX(-25%) rotate(2deg) scale(1.1)" },
          "100%": { transform: "translateX(-50%) rotate(-2deg)" }
        },
        "fl-jitter": {
          "0%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0, 0)" }
        },
        "fl-shake": {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0) rotate(-1deg)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0) rotate(1deg)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0) skewX(-5deg)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0) skewX(5deg)" }
        },
        "scanline": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" }
        }
      },
      backgroundImage: {
        "fl-mesh":
          "radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.15) 0%, transparent 70%), radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        "fl-gradient-fade": "linear-gradient(180deg, transparent 0%, #000000 100%)",
      }
    }
  },
  plugins: []
};
