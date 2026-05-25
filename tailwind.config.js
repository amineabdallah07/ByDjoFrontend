/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        /* ====================================================================
         * BY DJO — Light Boutique Theme (Men's Fashion)
         * Premium, editorial, Apple/Nike-admin inspired.
         * Champagne accent over warm off-white. Type-driven.
         * ==================================================================== */

        // Champagne brass — accent color (kept from previous identity)
        primary: {
          DEFAULT: "#b8924a",
          50:  "#fbf7ef",
          100: "#f4ead2",
          200: "#e8d3a3",
          300: "#dab874",
          400: "#cca256",
          500: "#b8924a",
          600: "#97763a",
          700: "#735a2e",
          800: "#4f3e22",
          900: "#2f2615",
          950: "#1a1510",
        },

        /* The `dark` scale is intentionally inverted so existing utility
         * class names (bg-dark-950, text-dark-200, border-dark-700, etc.)
         * still semantically work in the new light theme:
         *   - bg-dark-950 = page background (near white)
         *   - bg-dark-900 = subtle panel
         *   - bg-dark-800 = soft card / chip
         *   - text-dark-200 / 300 = primary body text (almost black)
         *   - text-dark-400 / 500 = muted text
         *   - border-dark-700 / 800 = hairline borders
         */
        dark: {
          DEFAULT: "#0d0c0a",
          50:  "#0d0c0a",
          100: "#1a1815",
          200: "#23201b",
          300: "#3a352d",
          400: "#6b6457",
          500: "#8a8275",
          600: "#b3ac9d",
          700: "#dcd5c5",
          800: "#ebe5d6",
          900: "#f7f3ea",
          950: "#fbf8f1",
        },

        gold:   { DEFAULT: "#c9a96e", 400: "#dab874", 500: "#c9a96e" },

        background: "#ffffff",
        foreground: "#1a1815",
        card:       { DEFAULT: "#ffffff",  foreground: "#1a1815" },
        popover:    { DEFAULT: "#ffffff",  foreground: "#1a1815" },
        secondary:  { DEFAULT: "#f7f3ea",  foreground: "#1a1815" },
        muted:      { DEFAULT: "#f7f3ea",  foreground: "#6b6457" },
        accent:     { DEFAULT: "#b8924a",  foreground: "#ffffff" },
        destructive:{ DEFAULT: "#b53b2a",  foreground: "#ffffff" },
        border: "#ebe5d6",
        input:  "#ebe5d6",
        ring:   "#b8924a",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        serif:   ["'Playfair Display'", "Georgia", "serif"],
        sans:    ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: { widest: "0.32em" },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        elegant:    "0 24px 64px -28px rgba(23, 20, 15, 0.18)",
        card:       "0 8px 28px -10px rgba(23, 20, 15, 0.10)",
        "card-hover":"0 22px 60px -20px rgba(23, 20, 15, 0.18)",
        gold:       "0 14px 40px -14px rgba(184, 146, 74, 0.40)",
        "gold-lg":  "0 30px 80px -22px rgba(184, 146, 74, 0.45)",
        "inner-glow":"inset 0 1px 0 0 rgba(255,255,255,0.6)",
        hairline:   "inset 0 0 0 1px rgba(23, 20, 15, 0.06)",
      },
      backgroundImage: {
        "gradient-gold":        "linear-gradient(135deg, #dab874 0%, #b8924a 55%, #97763a 100%)",
        "gradient-hero":        "linear-gradient(180deg, #ffffff 0%, #f7f3ea 100%)",
        "gradient-radial-gold": "radial-gradient(ellipse at top, rgba(184,146,74,0.10), transparent 60%)",
        "gradient-vignette":    "radial-gradient(ellipse at center, transparent 40%, rgba(23,20,15,0.06) 100%)",
        "noise":                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0.04 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp:    { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeDown:  { "0%": { opacity: "0", transform: "translateY(-14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideLeft: { "0%": { opacity: "0", transform: "translateX(-24px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        slideRight:{ "0%": { opacity: "0", transform: "translateX(24px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        scaleIn:   { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        marquee:   { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        "fade-in":    "fadeIn 0.6s ease-out forwards",
        "fade-up":    "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-down":  "fadeDown 0.5s ease-out forwards",
        "slide-left": "slideLeft 0.6s ease-out forwards",
        "slide-right":"slideRight 0.6s ease-out forwards",
        "scale-in":   "scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer:      "shimmer 2.4s linear infinite",
        marquee:      "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
