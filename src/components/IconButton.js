import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";
import AppIcon from "./AppIcon";
import { radius } from "../constants/theme";

// filled: заливка primary-цветом (для акцентных действий).
// По умолчанию — просто иконка на поверхности, без лишней рамки.
export default function IconButton({ name, onPress, size = 20, filled = false, color, disabled, style }) {
  const theme = useTheme();
  const bg = filled ? theme.primary : "transparent";
  const iconColor = color || (filled ? theme.onPrimary : theme.text);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.4 : 1 }, style]}
      hitSlop={8}
    >
      <AppIcon name={name} size={size} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 38, height: 38, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center",
  },
});
