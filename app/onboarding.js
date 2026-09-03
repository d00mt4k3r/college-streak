import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../src/context/AppContext";
import { colors, spacing, radius } from "../src/constants/theme";
import Card from "../src/components/Card";

// Онбординг — это одноразовая настройка при первом запуске (пункт 18 задания).
// Здесь мы просим создать хотя бы предметы, а расписание пользователь донастраивает
// на отдельном экране (кнопка ниже), чтобы не перегружать один экран сложной формой.

export default function OnboardingScreen() {
  const router = useRouter();
  const { data, addSubject, deleteSubject, finishOnboarding } = useApp();
  const [name, setName] = useState("");

  if (!data) return null;

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addSubject(trimmed);
    setName("");
  };

  const handleFinish = () => {
    finishOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.title}>Добро пожаловать 👋</Text>
      <Text style={styles.subtitle}>
        Настроим приложение за пару шагов. Ничего регистрировать не нужно — все данные останутся только на этом телефоне.
      </Text>

      <Text style={styles.step}>Шаг 1. Добавь свои предметы</Text>
      <Card>
        {data.subjects.map((s) => (
          <View key={s.id} style={styles.subjectRow}>
            <Text style={styles.subjectName}>📚 {s.name}</Text>
            <Pressable onPress={() => deleteSubject(s.id)}><Text style={styles.remove}>✕</Text></Pressable>
          </View>
        ))}
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="Например: Программирование"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleAdd}
          />
          <Pressable style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>
      </Card>

      <Text style={styles.step}>Шаг 2. Настрой расписание</Text>
      <Card>
        <Text style={styles.hint}>
          Создай шаблон недели (или два — например «чётная» и «нечётная») и добавь в него пары.
          Это можно сделать и позже, в любой момент — через кнопку настроек ⚙️ на главном экране.
        </Text>
        <Pressable style={styles.scheduleBtn} onPress={() => router.push("/schedule")}>
          <Text style={styles.scheduleBtnText}>Перейти к расписанию</Text>
        </Pressable>
      </Card>

      <Pressable style={styles.finishBtn} onPress={handleFinish}>
        <Text style={styles.finishBtnText}>Готово, к приложению! 🚀</Text>
      </Pressable>
      <Text style={styles.laterHint}>Расписание и предметы всегда можно изменить позже.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "800", marginBottom: spacing.sm },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.lg, lineHeight: 20 },
  step: { color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginBottom: spacing.sm, marginTop: spacing.md },
  subjectRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.xs },
  subjectName: { color: colors.textPrimary, fontSize: 15 },
  remove: { color: colors.textSecondary, fontSize: 16, paddingHorizontal: spacing.sm },
  addRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  input: {
    flex: 1, backgroundColor: colors.cardAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  addBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  addBtnText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  hint: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  scheduleBtn: { backgroundColor: colors.info, borderRadius: radius.md, padding: spacing.sm, alignItems: "center" },
  scheduleBtnText: { color: "#fff", fontWeight: "700" },
  finishBtn: { backgroundColor: colors.accent, borderRadius: radius.md, padding: spacing.md, alignItems: "center", marginTop: spacing.lg },
  finishBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  laterHint: { color: colors.textSecondary, fontSize: 12, textAlign: "center", marginTop: spacing.sm },
});
