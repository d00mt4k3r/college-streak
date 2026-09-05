// Крупное число + подпись, без карточки и без рамки. Используется на главном экране
// вместо набора одинаковых "карточек со статистикой".

import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";

export default function StatBlock({ value, label, size = "md", color }) {
  const theme = useTheme();
  const fontSize = size === "lg" ? 40 : size === "sm" ? 20 : 26;

  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color: color || theme.text, fontSize }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  value: { fontWeight: "800", letterSpacing: -0.5 },
  label: { fontSize: 11, fontWeight: "600", letterSpacing: 0.6, textTransform: "uppercase", marginTop: 2 },
});
