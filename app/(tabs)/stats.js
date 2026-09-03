import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing } from "../../src/constants/theme";
import Card from "../../src/components/Card";
import { ACHIEVEMENTS_LIST } from "../../src/logic/achievements";

function StatRow({ icon, label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{icon} {label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const { data, ready } = useApp();
  if (!ready || !data) return null;

  const { stats } = data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Card style={{ marginBottom: spacing.md }}>
        <StatRow icon="🔥" label="Текущий стрик" value={`${stats.currentStreak} дней`} />
        <StatRow icon="🏆" label="Лучший стрик" value={`${stats.bestStreak} дней`} />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <StatRow icon="📅" label="Посещено учебных дней" value={stats.daysAttended} />
        <StatRow icon="❌" label="Пропущено учебных дней" value={stats.daysMissed} />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <StatRow icon="🎓" label="Посещено пар" value={stats.lessonsAttended} />
        <StatRow icon="❌" label="Пропущено пар" value={stats.lessonsMissed} />
      </Card>

      <Text style={styles.sectionTitle}>Достижения</Text>
      <Card>
        {ACHIEVEMENTS_LIST.map((a) => {
          const unlocked = data.achievements.includes(a.id);
          return (
            <View key={a.id} style={styles.achievementRow}>
              <Text style={[styles.achievementIcon, !unlocked && styles.locked]}>{a.icon}</Text>
              <Text style={[styles.achievementTitle, !unlocked && styles.locked]}>{a.title}</Text>
              {unlocked && <Text style={styles.unlockedBadge}>✓</Text>}
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
  statLabel: { color: colors.textPrimary, fontSize: 15 },
  statValue: { color: colors.textPrimary, fontSize: 15, fontWeight: "700" },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: spacing.sm, marginTop: spacing.sm },
  achievementRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  achievementIcon: { fontSize: 22, marginRight: spacing.sm },
  achievementTitle: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: "600" },
  locked: { opacity: 0.35 },
  unlockedBadge: { color: colors.success, fontWeight: "700" },
});
