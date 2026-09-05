import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";
import { radius, spacing } from "../constants/theme";

export default function PrimaryButton({ label, onPress, disabled, variant = "solid", style }) {
  const theme = useTheme();

  const bg = variant === "solid" ? theme.primary : "transparent";
  const textColor = variant === "solid" ? theme.onPrimary : theme.primary;
  const borderColor = variant === "outline" ? theme.primary : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg,
    borderRadius: radius.md, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center",
  },
  label: { fontWeight: "700", fontSize: 15 },
});
