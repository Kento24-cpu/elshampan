import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme, vars } from "nativewind";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { DEFAULT_SCHEME, themes } from "../theme";

const STORAGE_KEY = "@elshampan/theme";

export const THEME_OPTIONS = [
  { value: "system", label: "Sistema", icon: "phone-portrait-outline" },
  { value: "light", label: "Claro", icon: "sunny-outline" },
  { value: "dark", label: "Oscuro", icon: "moon-outline" }
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (active && stored && themes[stored]) setPreferenceState(stored);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  // Keeps third party widgets, the keyboard and any `dark:` variant in sync.
  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);

  const setPreference = useCallback((next) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme = preference === "system" ? systemScheme ?? DEFAULT_SCHEME : preference;
  const theme = themes[scheme] ?? themes[DEFAULT_SCHEME];

  const value = useMemo(() => ({
    preference,
    setPreference,
    scheme,
    isDark: scheme === "dark",
    colors: theme.colors,
    gradient: theme.gradient,
    rootStyle: vars(theme.vars),
    hydrated
  }), [preference, setPreference, scheme, theme, hydrated]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
