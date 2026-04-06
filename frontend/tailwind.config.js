// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── MedicwayCare Brand Palette (from logo) ──
        brand: {
          navy:      "#0E3F6D",  // deep shield blue
          teal:      "#1A7FA8",  // mid gradient teal
          green:     "#72BF44",  // lime cross green
          navyLight: "#1A5585",  // slightly lighter navy for hovers
          greenDark: "#5CA334",  // darker green for hovers
        },
        // Legacy aliases kept for backward compat
        primary:    "#0E3F6D",
        accent:     "#72BF44",
        lightbg:    "#FAFAFA",
        darktext:   "#1E293B",
        lighttext:  "#64748B",
        sectiondiv: "#E8F4F8",
        sectiondivgradient: "linear-gradient(135deg, #e6f2f8 0%, #d8eaf0 100%)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        smooth: "0 8px 30px rgba(16,24,40,0.06)",
      },
      borderRadius: {
        xl: "1rem",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
