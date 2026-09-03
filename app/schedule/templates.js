import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, radius } from "../../src/constants/theme";
import Card from "../../src/components/Card";

export default function TemplatesScreen() {
  const router = useRouter();
  const { data, ready, addTemplate, deleteTemplate } = useApp();
  const [name, setName] = useState("");

  if (!ready || !data) return null;

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addTemplate(trimmed);
    setName("");
  };

  const handleDelete = (id, tName) => {
    Alert.alert("Удалить шаблон?", `Шаблон «${tName}» и все его пары будут удалены.`, [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: () => deleteTemplate(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.hint}>
        Например: «Чётная неделя» и «Нечётная неделя», или «Обычная неделя» и «Сессия».
      </Text>

      {data.templates.map((t) => {
        const totalLessons = Object.values(t.days).reduce((sum, list) => sum + list.length, 0);
        return (
          <Card key={t.id} style={{ marginBottom: spacing.sm }}>
            <Pressable onPress={() => router.push({ pathname: "/schedule/template-detail", params: { id: t.id } })}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.templateName}>{t.name}</Text>
                  <Text style={styles.templateMeta}>{totalLessons} пар в неделе</Text>
                </View>
                <Pressable onPress={() => handleDelete(t.id, t.name)} hitSlop={10}>
                  <Text style={styles.delete}>🗑️</Text>
                </Pressable>
              </View>
            </Pressable>
          </Card>
        );
      })}

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Название нового шаблона"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hint: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  templateName: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  templateMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  delete: { fontSize: 18 },
  addRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  input: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  addBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  addBtnText: { color: "#fff", fontSize: 22, fontWeight: "700" },
});
