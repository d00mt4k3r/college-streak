import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

export default function TaskItem({ title, done, onToggle, onDelete }) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <Text style={styles.checkbox}>{done ? "✅" : "☐"}</Text>
      <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
      <Pressable onPress={onDelete} hitSlop={10}>
        <Text style={styles.delete}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: { fontSize: 18, marginRight: spacing.sm },
  title: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  titleDone: { color: colors.textSecondary, textDecorationLine: "line-through" },
  delete: { color: colors.textSecondary, fontSize: 16, paddingHorizontal: spacing.xs },
});
