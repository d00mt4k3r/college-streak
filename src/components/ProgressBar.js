import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

// value / total -> заполненная полоска. Если total === 0, показываем пустую полоску.
export default function ProgressBar({ value, total, label, color = colors.success }) {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <View style={{ marginVertical: spacing.xs }}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.count}>{value} / {total}</Text>
        </View>
      ) : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  label: { color: colors.textPrimary, fontSize: 14, fontWeight: "600" },
  count: { color: colors.textSecondary, fontSize: 13 },
  track: {
    height: 10,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.sm,
  },
});
