// Every colour lives in ./src/theme/palette.json so that this config and
// src/theme/index.js cannot drift apart. Nothing outside those two files should
// contain a hex literal.

const palette = require("./src/theme/palette.json");

module.exports = {
  content: [
    "./App.js",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [
    require("nativewind/preset")
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: palette.gold,

        // Semantic tokens resolved from the CSS variables that ThemeProvider
        // installs with NativeWind's `vars()`. Never add an opacity modifier
        // (`bg-surface/50`) to these: Tailwind cannot apply alpha to a var().
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
        line: "var(--color-line)",
        content: "var(--color-content)",
        muted: "var(--color-muted)",
        subtle: "var(--color-subtle)",
        placeholder: "var(--color-placeholder)",
        tint: "var(--color-tint)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        danger: "var(--color-danger)"
      }
    }
  },
  plugins: []
};
