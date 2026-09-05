// Простой color picker: слайдер оттенка (Hue) + живой предпросмотр выбранного цвета.
// Специально не делаем полноценный HSL-квадрат с насыщенностью/яркостью — это была бы
// избыточная сложность для личного приложения. Насыщенность и яркость зафиксированы
// на значениях, которые хорошо ложатся в генератор палитры (theme/palette.js).

import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "../theme/useTheme";
import { hslToHex, hexToHsl } from "../theme/color-utils";
import { spacing, radius } from "../constants/theme";

const FIXED_SATURATION = 70;
const FIXED_LIGHTNESS = 55;

export default function HuePicker({ value, onChange }) {
  const theme = useTheme();
  const hue = hexToHsl(value).h;

  const handleSlide = (h) => {
    onChange(hslToHex(h, FIXED_SATURATION, FIXED_LIGHTNESS));
  };

  // Радужная полоска-фон под слайдером — рисуем несколькими сегментами
  const segments = Array.from({ length: 12 }, (_, i) => hslToHex((i * 360) / 12, FIXED_SATURATION, FIXED_LIGHTNESS));

  return (
    <View>
      <View style={styles.previewRow}>
        <View style={[styles.swatch, { backgroundColor: value, borderColor: theme.border }]} />
        <Text style={[styles.hexLabel, { color: theme.textSecondary }]}>{value.toUpperCase()}</Text>
      </View>
      <View style={styles.rainbow}>
        {segments.map((c, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: c }} />
        ))}
      </View>
      <Slider
        style={{ width: "100%", height: 32 }}
        minimumValue={0}
        maximumValue={359}
        value={hue}
        onValueChange={handleSlide}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor={theme.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm, gap: spacing.sm },
  swatch: { width: 36, height: 36, borderRadius: radius.md, borderWidth: 1 },
  hexLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 1 },
  rainbow: { flexDirection: "row", height: 8, borderRadius: radius.sm, overflow: "hidden", marginBottom: -12 },
});
