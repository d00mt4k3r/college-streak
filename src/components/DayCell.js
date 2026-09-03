import { Pressable, Text, StyleSheet } from "react-native";
import { colors, radius } from "../constants/theme";

const STATUS_COLORS = {
  complete: colors.success,
  incomplete: colors.danger,
  sick: colors.sick,
  holiday: colors.holiday,
};

const STATUS_EMOJI = {
  complete: "🟩",
  incomplete: "🟥",
  sick: "🏥",
  holiday: "🎉",
};

export default function DayCell({ dayNumber, status, inMonth, isToday, onPress }) {
  const bg = status ? STATUS_COLORS[status] : "transparent";

  return (
    <Pressable onPress={onPress} style={[styles.cell, isToday && styles.today]}>
      <Text style={[styles.dayNumber, !inMonth && styles.outOfMonth]}>{dayNumber}</Text>
      {status ? (
        <Text style={styles.marker}>{STATUS_EMOJI[status]}</Text>
      ) : (
        <Text style={styles.marker}>⬜</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },
  today: { borderWidth: 1.5, borderColor: colors.accent },
  dayNumber: { color: colors.textPrimary, fontSize: 13, fontWeight: "600" },
  outOfMonth: { color: colors.textSecondary, opacity: 0.4 },
  marker: { fontSize: 12, marginTop: 2 },
});
