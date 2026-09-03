import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, radius } from "../../src/constants/theme";
import StreakDisplay from "../../src/components/StreakDisplay";
import Card from "../../src/components/Card";
import LessonRow from "../../src/components/LessonRow";
import ProgressBar from "../../src/components/ProgressBar";
import { todayKey, formatHuman } from "../../src/utils/date";

export default function HomeScreen() {
  const router = useRouter();
  const { data, ready, getDayEntry, setLessonAttendance, setDaySick, setDayHoliday, reopenDayAction } = useApp();

  if (!ready || !data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!data.meta.firstLaunchDone) {
    return <Redirect href="/onboarding" />;
  }

  const dateKey = todayKey();
  const entry = getDayEntry(dateKey);
  const isStudyDay = entry.lessons.length > 0 || entry.status === "pending";
  const attendedCount = entry.lessons.filter((l) => l.attended === true).length;

  const subjectName = (id) => data.subjects.find((s) => s.id === id)?.name || "Предмет удалён";
  const tasksDone = Object.values(data.tasks).flat().filter((t) => t.done).length;
  const tasksAll = Object.values(data.tasks).flat().length;

  const confirmSick = () => {
    Alert.alert("Больничный", "Отметить сегодняшний день как больничный? Стрик не сбросится и не увеличится.", [
      { text: "Отмена", style: "cancel" },
      { text: "Отметить", onPress: () => setDaySick(dateKey) },
    ]);
  };

  const confirmHoliday = () => {
    Alert.alert("Выходной", "Отметить сегодняшний день как праздник/выходной?", [
      { text: "Отмена", style: "cancel" },
      { text: "Отметить", onPress: () => setDayHoliday(dateKey) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Сегодня, {formatHuman(dateKey)}</Text>
        <Pressable onPress={() => router.push("/schedule")}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>

      <StreakDisplay current={data.stats.currentStreak} best={data.stats.bestStreak} />

      {tasksAll > 0 && (
        <Card style={{ marginBottom: spacing.md }}>
          <ProgressBar value={tasksDone} total={tasksAll} label="📚 Задания" color={colors.accent} />
        </Card>
      )}

      {entry.status === "sick" && (
        <Card style={{ marginBottom: spacing.md, borderColor: colors.sick }}>
          <Text style={styles.statusText}>🏥 Сегодня отмечен больничный. Стрик заморожен.</Text>
          <Pressable onPress={() => reopenDayAction(dateKey)}><Text style={styles.undo}>Отменить отметку</Text></Pressable>
        </Card>
      )}

      {entry.status === "holiday" && (
        <Card style={{ marginBottom: spacing.md, borderColor: colors.holiday }}>
          <Text style={styles.statusText}>🎉 Сегодня выходной/праздник.</Text>
          <Pressable onPress={() => reopenDayAction(dateKey)}><Text style={styles.undo}>Отменить отметку</Text></Pressable>
        </Card>
      )}

      {entry.status === "none" && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.statusText}>Сегодня по расписанию нет пар.</Text>
        </Card>
      )}

      {(entry.status === "pending" || entry.status === "complete" || entry.status === "incomplete") && entry.lessons.length > 0 && (
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Посещение</Text>
            <Text style={styles.attendanceCount}>{attendedCount} / {entry.lessons.length} пар</Text>
          </View>

          {entry.lessons.map((lesson, index) => (
            <LessonRow
              key={lesson.lessonId + index}
              subjectName={subjectName(lesson.subjectId)}
              startTime={lesson.startTime}
              endTime={lesson.endTime}
              attended={lesson.attended}
              disabled={entry.closed}
              onMark={(value) => setLessonAttendance(dateKey, index, value)}
            />
          ))}

          {entry.closed ? (
            <View style={styles.closedBanner}>
              <Text style={styles.closedText}>
                {entry.status === "complete" ? "✅ День закрыт — все пары посещены!" : "❌ День закрыт — стрик сброшен."}
              </Text>
              <Pressable onPress={() => reopenDayAction(dateKey)}>
                <Text style={styles.undo}>Исправить отметки</Text>
              </Pressable>
            </View>
          ) : null}
        </Card>
      )}

      {!entry.closed && (
        <View style={styles.specialButtons}>
          <Pressable style={[styles.specialBtn, { borderColor: colors.sick }]} onPress={confirmSick}>
            <Text style={styles.specialBtnText}>🏥 Больничный</Text>
          </Pressable>
          <Pressable style={[styles.specialBtn, { borderColor: colors.holiday }]} onPress={confirmHoliday}>
            <Text style={styles.specialBtnText}>🎉 Выходной</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  settingsIcon: { fontSize: 22 },
  statusText: { color: colors.textPrimary, fontSize: 15, fontWeight: "600", marginBottom: spacing.xs },
  undo: { color: colors.info, fontSize: 13, marginTop: spacing.xs },
  attendanceHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm },
  attendanceTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  attendanceCount: { color: colors.textSecondary, fontSize: 14 },
  closedBanner: { marginTop: spacing.sm, paddingTop: spacing.sm },
  closedText: { color: colors.textPrimary, fontSize: 14, fontWeight: "600" },
  specialButtons: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  specialBtn: { flex: 1, borderWidth: 1.5, borderRadius: radius.md, padding: spacing.sm, alignItems: "center" },
  specialBtnText: { color: colors.textPrimary, fontWeight: "600" },
});
