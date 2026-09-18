module.exports = {
  content: [
    "./App.js",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [
    require("nativewind/preset")
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#F6D77A",
          400: "#E9B949",
          500: "#C99222",
          600: "#9E6D12"
        }
      }
    }
  },
  plugins: []
};