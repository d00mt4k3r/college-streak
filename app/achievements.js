import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/useTheme";
import { spacing, radius } from "../src/constants/theme";
import Section from "../src/components/Section";
import StatBlock from "../src/components/StatBlock";
import ProgressBar from "../src/components/ProgressBar";
import AchievementIcon from "../src/components/AchievementIcon";
import { ACHIEVEMENTS } from "../src/data/achievements";
import { computeMetrics, getProgress } from "../src/logic/achievements";
import { useI18n } from "../src/i18n";
import { getAchievementContent } from "../src/i18n/achievements";

const CATEGORY_KEYS = {
  streak: "streak",
  attendance: "attendance",
  tasks: "tasks",
  perfect_day: "perfectDay",
  calendar: "calendar",
  recovery: "recovery",
  subjects: "subjects",
  gacha: "gachaTitle",
  xp: "xp",
};

const CATEGORY_ORDER = ["streak", "attendance", "tasks", "perfect_day", "calendar", "recovery", "subjects", "gacha", "xp"];

export default function AchievementsScreen() {
  const theme = useTheme();
  const { t, language } = useI18n();
  const { data, ready } = useApp();
  if (!ready || !data) return null;

  const metrics = computeMetrics(data);
  const unlockedIds = new Set(data.unlockedAchievements || []);
  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id)).length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
      <View style={styles.heroRow}>
        <StatBlock value={unlockedCount} label={t("received")} size="lg" color={theme.primary} />
        <StatBlock value={totalCount - unlockedCount} label={t("remaining")} />
      </View>
      <ProgressBar value={unlockedCount} total={totalCount} />

      {CATEGORY_ORDER.map((category) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === category);
        if (items.length === 0) return null;

        return (
          <Section key={category} title={t(CATEGORY_KEYS[category] || category)} style={{ marginTop: spacing.lg }}>
            {items.map((a) => {
              const unlocked = unlockedIds.has(a.id);
              const content = getAchievementContent(a, language);
              const progress = unlocked ? null : getProgress(a.condition, metrics);
              return (
                <View key={a.id} style={[styles.row, { opacity: unlocked ? 1 : 0.55 }]}>
                  <View style={[styles.iconWrap, { backgroundColor: unlocked ? theme.primaryLight : theme.surfaceSecondary }]}>
                    <AchievementIcon achievement={a} size={20} color={unlocked ? theme.primaryDark : theme.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: theme.text }]}>{content.title}</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>{content.description}</Text>
                    {progress && progress.target > 1 && (
                      <ProgressBar value={progress.current} total={progress.target} compact color={theme.textSecondary} />
                    )}
                  </View>
                  <Text style={[styles.reward, { color: unlocked ? theme.success : theme.textSecondary }]}>+{a.rewardXP}</Text>
                </View>
              );
            })}
          </Section>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: "row", gap: spacing.xl, marginBottom: spacing.md, paddingHorizontal: spacing.xs },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm },
  iconWrap: { width: 38, height: 38, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "700" },
  description: { fontSize: 12, marginTop: 2, marginBottom: 4 },
  reward: { fontSize: 12, fontWeight: "800", marginLeft: spacing.xs },
});
