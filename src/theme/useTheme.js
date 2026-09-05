// Главный способ получить цвета в любом компоненте: const theme = useTheme();
// Больше НИГДЕ в приложении цвета не прописываются напрямую — только через эту палитру.

import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useApp } from "../context/AppContext";
import { generatePalette, DEFAULT_ACCENT } from "./palette";

export function useTheme() {
  const { data } = useApp();
  const systemScheme = useColorScheme(); // "light" | "dark" | null (Android/iOS системная тема)

  const themeMode = data?.settings?.themeMode || "system";
  const accentColor = data?.settings?.accentColor || DEFAULT_ACCENT;
  const resolvedMode = themeMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : themeMode;

  return useMemo(() => generatePalette(accentColor, resolvedMode), [accentColor, resolvedMode]);
}
