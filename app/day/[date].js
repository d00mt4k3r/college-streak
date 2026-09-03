import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, radius } from "../../src/constants/theme";
import Card from "../../src/components/Card";
import LessonRow from "../../src/components/LessonRow";
import { formatHuman, weekDayKeyOf, fromDateKey } from "../../src/utils/date";
import { getTemplateForDate } from "../../src/logic/schedule";

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams();
  const { data, ready, getDayEntry, setLessonAttendance, setDaySick, setDayHoliday, reopenDayAction, setSpecialSchedule } = useApp();
  const [editingSpecial, setEditingSpecial] = useState(false);
  const [checkedLessonIds, setCheckedLessonIds] = useState([]);
  const [baseLessonsForEditing, setBaseLessonsForEditing] = useState([]);

  if (!ready || !data) return null;

  const entry = getDayEntry(date);
  const subjectName = (id) => data.subjects.find((s) => s.id === id)?.name || "Предмет удалён";

  const statusLabel = {
    complete: "✅ Все пары посещены",
    incomplete: "❌ Был прогул",
    sick: "🏥 Больничный",
    holiday: "🎉 Выходной / праздник",
    pending: "⏳ День ещё не закрыт",
    none: "Нет пар по расписанию",
  }[entry.status];

  const openSpecialEditor = () => {
    const template = getTemplateForDate(date, data);
    const dayKey = weekDayKeyOf(fromDateKey(date));
    const baseLessons = template ? [...(template.days[dayKey] || [])].sort((a, b) => a.order - b.order) : [];
    setCheckedLessonIds(baseLessons.map((l) => l.id));
    setEditingSpecial(true);
    // сохраняем базовые пары во временном состоянии через замыкание ниже
    setBaseLessonsForEditing(baseLessons);
  };

  const toggleChecked = (lessonId) => {
    setCheckedLessonIds((prev) => (prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]));
  };

  const saveSpecialSchedule = () => {
    const selected = baseLessonsForEditing.filter((l) => checkedLessonIds.includes(l.id));
    setSpecialSchedule(date, selected);
    setEditingSpecial(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>{formatHuman(date)}</Text>
      <Text style={styles.status}>{statusLabel}</Text>

      {!editingSpecial && entry.lessons.length > 0 && (
        <Card style={{ marginVertical: spacing.md }}>
          {entry.lessons.map((lesson, index) => (
            <LessonRow
              key={lesson.lessonId + index}
              subjectName={subjectName(lesson.subjectId)}
              startTime={lesson.startTime}
              endTime={lesson.endTime}
              attended={lesson.attended}
              disabled={entry.closed}
              onMark={(value) => setLessonAttendance(date, index, value)}
            />
          ))}
        </Card>
      )}

      {editingSpecial && (
        <Card style={{ marginVertical: spacing.md }}>
          <Text style={styles.hint}>Отметь, какие пары должны быть именно в этот день (шаблон недели не изменится):</Text>
          {baseLessonsForEditing.map((l) => (
            <Pressable key={l.id} onPress={() => toggleChecked(l.id)} style={styles.checkRow}>
              <Text style={styles.checkbox}>{checkedLessonIds.includes(l.id) ? "✅" : "☐"}</Text>
              <Text style={styles.checkLabel}>{l.startTime}–{l.endTime} · {subjectName(l.subjectId)}</Text>
            </Pressable>
          ))}
          <View style={styles.formButtons}>
            <Pressable style={styles.cancelBtn} onPress={() => setEditingSpecial(false)}>
              <Text style={styles.cancelBtnText}>Отмена</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={saveSpecialSchedule}>
              <Text style={styles.saveBtnText}>Сохранить на этот день</Text>
            </Pressable>
          </View>
        </Card>
      )}

      <View style={styles.actions}>
        {!editingSpecial && (
          <Pressable style={styles.actionBtn} onPress={openSpecialEditor}>
            <Text style={styles.actionBtnText}>✏️ Особое расписание на этот день</Text>
          </Pressable>
        )}
        {entry.status !== "sick" && (
          <Pressable
            style={[styles.actionBtn, { borderColor: colors.sick }]}
            onPress={() => Alert.alert("Больничный", "Отметить этот день как больничный?", [
              { text: "Отмена", style: "cancel" },
              { text: "Отметить", onPress: () => setDaySick(date) },
            ])}
          >
            <Text style={styles.actionBtnText}>🏥 Отметить больничный</Text>
          </Pressable>
        )}
        {entry.status !== "holiday" && (
          <Pressable
            style={[styles.actionBtn, { borderColor: colors.holiday }]}
            onPress={() => Alert.alert("Выходной", "Отметить этот день как праздник/выходной?", [
              { text: "Отмена", style: "cancel" },
              { text: "Отметить", onPress: () => setDayHoliday(date) },
            ])}
          >
            <Text style={styles.actionBtnText}>🎉 Отметить выходной</Text>
          </Pressable>
        )}
        {(entry.closed || entry.status === "sick" || entry.status === "holiday") && (
          <Pressable style={styles.actionBtn} onPress={() => reopenDayAction(date)}>
            <Text style={styles.actionBtnText}>↩️ Сбросить и редактировать заново</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "700" },
  status: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  hint: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.sm },
  checkRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.xs },
  checkbox: { fontSize: 16, marginRight: spacing.sm },
  checkLabel: { color: colors.textPrimary, fontSize: 14 },
  formButtons: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  cancelBtn: { flex: 1, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  cancelBtnText: { color: colors.textSecondary, fontWeight: "600" },
  saveBtn: { flex: 2, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700" },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  actionBtn: { padding: spacing.sm, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: "center" },
  actionBtnText: { color: colors.textPrimary, fontWeight: "600" },
});
