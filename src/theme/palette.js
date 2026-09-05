// Генератор полноценной цветовой палитры из ОДНОГО выбранного пользователем цвета.
// Это единственное место, где решается, как именно выглядят светлая и тёмная темы.
// Экраны никогда не задают цвета напрямую — только читают готовую палитру через useTheme().

import { hexToHsl, hslToHex, clamp, pickTextColor } from "./color-utils";

export const DEFAULT_ACCENT = "#7C5CFC"; // фиолетовый — цвет по умолчанию

// Готовые цвета для быстрого выбора в настройках (пункт 4 задания).
// Чтобы добавить свой готовый цвет — просто добавь ещё одну строку сюда.
export const PRESET_COLORS = [
  { name: "Фиолетовый", value: "#7C5CFC" },
  { name: "Синий", value: "#3B82F6" },
  { name: "Зелёный", value: "#22C55E" },
  { name: "Красный", value: "#EF4444" },
  { name: "Розовый", value: "#EC4899" },
  { name: "Оранжевый", value: "#F97316" },
];

// Семантические цвета (успех/предупреждение/ошибка/больничный/выходной) НЕ зависят
// от выбранного акцента — они всегда должны означать одно и то же, независимо от темы.
// Меняется только их яркость, чтобы оставаться читаемыми на светлом/тёмном фоне.
const SEMANTIC = {
  light: { success: "#1F9D55", warning: "#B7791F", error: "#DC2626", sick: "#8B5CF6", holiday: "#0D9488", info: "#2563EB" },
  dark: { success: "#4ADE80", warning: "#FBBF24", error: "#F87171", sick: "#C4B5FD", holiday: "#5EEAD4", info: "#60A5FA" },
};

// Генерирует полную палитру для одного режима (light/dark) на основе hex-цвета акцента.
export function generatePalette(accentHex, mode) {
  const { h, s } = hexToHsl(accentHex || DEFAULT_ACCENT);
  const semantic = SEMANTIC[mode] || SEMANTIC.light;

  if (mode === "dark") {
    // В тёмной теме акцент должен быть достаточно светлым, чтобы читаться на тёмном фоне
    const primaryL = clamp(hexToHsl(accentHex).l, 50, 72);
    const primary = hslToHex(h, clamp(s, 45, 90), primaryL);
    const primaryLight = hslToHex(h, clamp(s, 35, 80), clamp(primaryL + 14, 0, 92));
    const primaryDark = hslToHex(h, clamp(s, 45, 90), clamp(primaryL - 18, 8, 100));

    const background = hslToHex(h, Math.min(s, 28), 7);
    const surface = hslToHex(h, Math.min(s, 22), 13);
    const surfaceSecondary = hslToHex(h, Math.min(s, 20), 18);
    const text = hslToHex(h, 14, 95);
    const textSecondary = hslToHex(h, 10, 68);
    const border = hslToHex(h, 20, 25);

    return {
      mode, primary, primaryLight, primaryDark,
      background, surface, surfaceSecondary, text, textSecondary, border,
      onPrimary: pickTextColor(primary),
      ...semantic,
    };
  }

  // Светлая тема: акцент не должен быть слишком светлым (иначе плохой контраст с белым текстом)
  const primaryL = clamp(hexToHsl(accentHex).l, 34, 56);
  const primary = hslToHex(h, clamp(s, 40, 88), primaryL);
  const primaryLight = hslToHex(h, clamp(s, 28, 70), clamp(primaryL + 20, 0, 94));
  const primaryDark = hslToHex(h, clamp(s, 40, 88), clamp(primaryL - 14, 8, 100));

  const background = hslToHex(h, Math.min(s, 22), 97);
  const surface = "#FFFFFF";
  const surfaceSecondary = hslToHex(h, Math.min(s, 20), 94);
  const text = hslToHex(h, 20, 14);
  const textSecondary = hslToHex(h, 10, 42);
  const border = hslToHex(h, 18, 87);

  return {
    mode, primary, primaryLight, primaryDark,
    background, surface, surfaceSecondary, text, textSecondary, border,
    onPrimary: pickTextColor(primary),
    ...semantic,
  };
}
