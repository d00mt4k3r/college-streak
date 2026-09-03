import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, radius, weekDays } from "../../src/constants/theme";
import Card from "../../src/components/Card";

const emptyForm = { subjectId: null, startTime: "", endTime: "", room: "", teacher: "" };

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data, ready, addLesson, updateLesson, deleteLesson, moveLesson } = useApp();
  const [dayKey, setDayKey] = useState("mon");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  if (!ready || !data) return null;
  const template = data.templates.find((t) => t.id === id);
  if (!template) return <Text style={styles.hint}>Шаблон не найден</Text>;

  const lessons = [...(template.days[dayKey] || [])].sort((a, b) => a.order - b.order);
  const subjectName = (sid) => data.subjects.find((s) => s.id === sid)?.name || "—";

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const startEdit = (lesson) => {
    setEditingId(lesson.id);
    setForm({ subjectId: lesson.subjectId, startTime: lesson.startTime, endTime: lesson.endTime, room: lesson.room || "", teacher: lesson.teacher || "" });
  };

  const handleSave = () => {
    if (!form.subjectId || !form.startTime || !form.endTime) {
      Alert.alert("Заполни поля", "Выбери предмет и укажи время начала и окончания пары.");
      return;
    }
    if (editingId) {
      updateLesson(template.id, dayKey, editingId, form);
    } else {
      addLesson(template.id, dayKey, form);
    }
    resetForm();
  };

  const handleDelete = (lessonId) => {
    Alert.alert("Удалить пару?", null, [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: () => deleteLesson(template.id, dayKey, lessonId) },
    ]);
  };

  if (data.subjects.length === 0) {
    return (
      <View style={{ padding: spacing.md }}>
        <Text style={styles.hint}>Сначала добавь хотя бы один предмет на вкладке «Задания», потом возвращайся сюда добавлять пары.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>{template.name}</Text>

      <View style={styles.daysRow}>
        {weekDays.map((d) => (
          <Pressable key={d.key} onPress={() => { setDayKey(d.key); resetForm(); }} style={[styles.dayChip, dayKey === d.key && styles.dayChipActive]}>
            <Text style={styles.dayChipText}>{d.short}</Text>
          </Pressable>
        ))}
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        {lessons.length === 0 && <Text style={styles.hint}>В этот день пар нет</Text>}
        {lessons.map((lesson, idx) => (
          <View key={lesson.id} style={styles.lessonRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTime}>{lesson.startTime} – {lesson.endTime}</Text>
              <Text style={styles.lessonSubject}>{subjectName(lesson.subjectId)}</Text>
              {(lesson.room || lesson.teacher) ? (
                <Text style={styles.lessonMeta}>{[lesson.room, lesson.teacher].filter(Boolean).join(" · ")}</Text>
              ) : null}
            </View>
            <View style={styles.lessonActions}>
              <Pressable disabled={idx === 0} onPress={() => moveLesson(template.id, dayKey, lesson.id, "up")}>
                <Text style={[styles.actionIcon, idx === 0 && styles.disabled]}>▲</Text>
              </Pressable>
              <Pressable disabled={idx === lessons.length - 1} onPress={() => moveLesson(template.id, dayKey, lesson.id, "down")}>
                <Text style={[styles.actionIcon, idx === lessons.length - 1 && styles.disabled]}>▼</Text>
              </Pressable>
              <Pressable onPress={() => startEdit(lesson)}><Text style={styles.actionIcon}>✏️</Text></Pressable>
              <Pressable onPress={() => handleDelete(lesson.id)}><Text style={styles.actionIcon}>🗑️</Text></Pressable>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.formTitle}>{editingId ? "Изменить пару" : "Добавить пару"}</Text>

        <Text style={styles.label}>Предмет</Text>
        <View style={styles.chipsRow}>
          {data.subjects.map((s) => (
            <Pressable key={s.id} onPress={() => setForm({ ...form, subjectId: s.id })} style={[styles.chip, form.subjectId === s.id && styles.chipActive]}>
              <Text style={styles.chipText}>{s.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.timeRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="09:00" placeholderTextColor={colors.textSecondary} value={form.startTime} onChangeText={(v) => setForm({ ...form, startTime: v })} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="10:30" placeholderTextColor={colors.textSecondary} value={form.endTime} onChangeText={(v) => setForm({ ...form, endTime: v })} />
        </View>

        <TextInput style={styles.input} placeholder="Аудитория (необязательно)" placeholderTextColor={colors.textSecondary} value={form.room} onChangeText={(v) => setForm({ ...form, room: v })} />
        <TextInput style={styles.input} placeholder="Преподаватель (необязательно)" placeholderTextColor={colors.textSecondary} value={form.teacher} onChangeText={(v) => setForm({ ...form, teacher: v })} />

        <View style={styles.formButtons}>
          {editingId && (
            <Pressable style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.cancelBtnText}>Отмена</Text>
            </Pressable>
          )}
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{editingId ? "Сохранить" : "Добавить пару"}</Text>
          </Pressable>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: "700", marginBottom: spacing.md },
  hint: { color: colors.textSecondary, fontSize: 13 },
  daysRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  dayChip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  dayChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayChipText: { color: colors.textPrimary, fontSize: 13, fontWeight: "700" },
  lessonRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  lessonTime: { color: colors.textSecondary, fontSize: 12 },
  lessonSubject: { color: colors.textPrimary, fontSize: 15, fontWeight: "700" },
  lessonMeta: { color: colors.textSecondary, fontSize: 12 },
  lessonActions: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  actionIcon: { fontSize: 16 },
  disabled: { opacity: 0.25 },
  formTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "700", marginBottom: spacing.sm },
  label: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.xs },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.sm },
  chip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.info, borderColor: colors.info },
  chipText: { color: colors.textPrimary, fontSize: 13, fontWeight: "600" },
  timeRow: { flexDirection: "row", gap: spacing.sm },
  input: {
    backgroundColor: colors.cardAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.sm,
  },
  formButtons: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  cancelBtn: { flex: 1, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  cancelBtnText: { color: colors.textSecondary, fontWeight: "600" },
  saveBtn: { flex: 2, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700" },
});
