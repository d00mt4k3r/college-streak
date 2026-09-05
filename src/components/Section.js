// Лёгкая замена "карточке для всего": просто заголовок капслоком + тонкая
// разделительная линия сверху. Используется вместо огромного количества
// одинаковых rounded card — по духу ближе к разделам в настройках iOS/Android,
// чем к "AI dashboard".

import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";
import { spacing } from "../constants/theme";

export default function Section({ title, children, style, right }) {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      {title ? (
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
          {right}
        </View>
      ) : null}
      <View style={[styles.line, { backgroundColor: theme.border }]} />
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: spacing.xs },
  title: { fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" },
  line: { height: 1, marginBottom: spacing.sm },
});
