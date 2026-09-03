import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import ProgressBar from "./ProgressBar";

export default function SubjectItem({ name, done, total, onPress, onDelete }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>📚 {name}</Text>
        <Pressable onPress={onDelete} hitSlop={10}>
          <Text style={styles.delete}>🗑️</Text>
        </Pressable>
      </View>
      <ProgressBar value={done} total={total} color={colors.info} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  delete: { fontSize: 16 },
});
