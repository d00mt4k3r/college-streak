import { View, Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";
import { radius, spacing } from "../constants/theme";

// options: [{ value, label }]
export default function SegmentedControl({ options, value, onChange }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceSecondary }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.label, { color: active ? theme.text : theme.textSecondary }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", borderRadius: radius.md, padding: 3 },
  segment: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: "center" },
  label: { fontWeight: "700", fontSize: 13 },
});
