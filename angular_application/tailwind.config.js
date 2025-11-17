 /** Tailwind CSS configuration for Angular 19
  * Content globs include HTML/TS templates/components and the index.html.
  * Theme tokens aligned with "Ocean Professional" style guide.
  */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Professional palette
        primary: "#2563EB",     // blue
        secondary: "#F59E0B",   // amber
        success: "#22C55E",
        error: "#EF4444",
        background: "#f9fafb",
        surface: "#ffffff",
        text: "#111827"
      },
      gradientColorStops: {
        'ocean-start': 'rgba(59, 130, 246, 0.10)', // blue-500/10
        'ocean-end': '#f9fafb'
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)"
      },
      borderRadius: {
        card: "12px"
      }
    }
  },
  plugins: []
};
