import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../constants/theme";

export default function StreakDisplay({ current, best }) {
  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.number}>{current}</Text>
      <Text style={styles.caption}>{daysWord(current)} ПОДРЯД</Text>
      <View style={styles.bestRow}>
        <Text style={styles.bestText}>🏆 Лучший стрик: {best} {daysWord(best)}</Text>
      </View>
    </View>
  );
}

// Простое склонение слова "день" — приятная мелочь для русского интерфейса
function daysWord(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "ДНЕЙ";
  if (mod10 === 1) return "ДЕНЬ";
  if (mod10 >= 2 && mod10 <= 4) return "ДНЯ";
  return "ДНЕЙ";
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: spacing.lg },
  fire: { fontSize: 48 },
  number: { fontSize: 64, fontWeight: "800", color: colors.accent, lineHeight: 68 },
  caption: { fontSize: 14, letterSpacing: 2, color: colors.textSecondary, fontWeight: "700", marginTop: 4 },
  bestRow: { marginTop: spacing.md },
  bestText: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
});
