import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { useApp } from "../context/AppContext";
import { useTheme } from "../theme/useTheme";
import AchievementIcon from "./AchievementIcon";
import { useI18n } from "../i18n";
import { getAchievementContent } from "../i18n/achievements";
import { radius, spacing } from "../constants/theme";

// Показывает по одному уведомлению из очереди pendingUnlocks. Рендерится один раз
// в корне приложения, поэтому достижение можно получить на любом экране.
export default function AchievementToast() {
  const { pendingUnlocks, dismissUnlock } = useApp();
  const theme = useTheme();
  const { language, t } = useI18n();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const current = pendingUnlocks[0];

  useEffect(() => {
    if (!current) return;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        translateY.setValue(-20);
        dismissUnlock();
      });
    }, 3200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  if (!current) return null;
  const content = getAchievementContent(current, language);

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]} pointerEvents="box-none">
      <Pressable
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.primary }]}
        onPress={dismissUnlock}
      >
        <Text style={[styles.headline, { color: theme.primary }]}>{t("newAchievement")}</Text>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSecondary }]}>
            <AchievementIcon achievement={current} size={22} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>{content.title}</Text>
            <Text style={[styles.xp, { color: theme.success }]}>+{current.rewardXP} XP</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 50, left: spacing.md, right: spacing.md, zIndex: 999 },
  card: {
    borderRadius: radius.md, borderWidth: 1.5, padding: spacing.md,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  headline: { fontWeight: "800", fontSize: 11, letterSpacing: 1.2, marginBottom: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "700", fontSize: 15 },
  xp: { fontWeight: "700", fontSize: 13, marginTop: 2 },
});
