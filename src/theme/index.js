import palette from "./palette.json";

// Single source of truth for every colour in the app, shared with
// tailwind.config.js through palette.json.
//
// `muted` and `subtle` are chosen so body and secondary text stay above the
// WCAG AA 4.5:1 ratio against `canvas`, `surface` and `elevated` in both themes.
// `accent` is the gold used for text and icons: the bright gold only passes on
// dark backgrounds, so the light theme uses the darker step of the scale.
// `accent-strong` is the gold for filled surfaces, with `onAccent` as the
// content colour placed on top of it.

// `onAccent` is skipped: it has no Tailwind class and would emit an unused variable.
const toVars = (colors) =>
  Object.fromEntries(
    Object.entries(colors)
      .filter(([token]) => token !== "onAccent")
      .map(([token, value]) => [`--color-${token}`, value])
  );

export const themes = {
  dark: { colors: palette.dark, gradient: palette.gradient.dark, vars: toVars(palette.dark) },
  light: { colors: palette.light, gradient: palette.gradient.light, vars: toVars(palette.light) }
};

export const DEFAULT_SCHEME = "dark";
export const ACCENT_BY_SCHEME = { dark: palette.dark.accent, light: palette.light.accent };
