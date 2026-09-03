import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, radius } from "../../src/constants/theme";
import Card from "../../src/components/Card";
import { mondayOf, toDateKey } from "../../src/utils/date";

export default function ScheduleHomeScreen() {
  const router = useRouter();
  const { data, ready, setSingleTemplate, setRotation } = useApp();
  const [buildingRotation, setBuildingRotation] = useState(false);
  const [rotationOrder, setRotationOrder] = useState([]);

  if (!ready || !data) return null;

  const { templates, scheduleSettings } = data;

  const startRotationBuilder = () => {
    setRotationOrder(scheduleSettings.rotation.templateIds || []);
    setBuildingRotation(true);
  };

  const tapTemplateForRotation = (id) => {
    setRotationOrder((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const confirmRotation = () => {
    if (rotationOrder.length < 2) return;
    const anchor = toDateKey(mondayOf(new Date()));
    setRotation(rotationOrder, anchor);
    setBuildingRotation(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.sectionTitle}>Шаблоны недель</Text>
      <Card style={{ marginBottom: spacing.md }}>
        {templates.length === 0 && <Text style={styles.hint}>Пока нет ни одного шаблона</Text>}
        {templates.map((t) => (
          <View key={t.id} style={styles.templateRow}>
            <Text style={styles.templateName}>{t.name}</Text>
          </View>
        ))}
        <Pressable style={styles.linkBtn} onPress={() => router.push("/schedule/templates")}>
          <Text style={styles.linkBtnText}>Управлять шаблонами и парами →</Text>
        </Pressable>
      </Card>

      <Text style={styles.sectionTitle}>Режим расписания</Text>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.hint}>
          {scheduleSettings.mode === "single"
            ? "Сейчас используется один и тот же шаблон каждую неделю."
            : "Сейчас шаблоны чередуются по неделям."}
        </Text>

        {!buildingRotation && (
          <>
            <Text style={styles.subLabel}>Один шаблон на все недели:</Text>
            <View style={styles.chipsRow}>
              {templates.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => setSingleTemplate(t.id)}
                  style={[
                    styles.chip,
                    scheduleSettings.mode === "single" && scheduleSettings.activeTemplateId === t.id && styles.chipActive,
                  ]}
                >
                  <Text style={styles.chipText}>{t.name}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.linkBtn} onPress={startRotationBuilder}>
              <Text style={styles.linkBtnText}>Настроить чередование шаблонов →</Text>
            </Pressable>
          </>
        )}

        {buildingRotation && (
          <View>
            <Text style={styles.subLabel}>Нажимай на шаблоны в том порядке, в котором они должны чередоваться:</Text>
            <View style={styles.chipsRow}>
              {templates.map((t) => {
                const pos = rotationOrder.indexOf(t.id);
                return (
                  <Pressable key={t.id} onPress={() => tapTemplateForRotation(t.id)} style={[styles.chip, pos >= 0 && styles.chipActive]}>
                    <Text style={styles.chipText}>{pos >= 0 ? `${pos + 1}. ` : ""}{t.name}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.hint}>Чередование начнётся с текущей недели.</Text>
            <View style={styles.rotationButtons}>
              <Pressable style={styles.cancelBtn} onPress={() => setBuildingRotation(false)}>
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={confirmRotation}>
                <Text style={styles.confirmBtnText}>Применить</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginBottom: spacing.sm },
  hint: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.sm },
  templateRow: { paddingVertical: spacing.xs },
  templateName: { color: colors.textPrimary, fontSize: 15 },
  linkBtn: { marginTop: spacing.sm },
  linkBtnText: { color: colors.info, fontWeight: "600" },
  subLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: "600", marginTop: spacing.sm, marginBottom: spacing.xs },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textPrimary, fontSize: 13, fontWeight: "600" },
  rotationButtons: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  cancelBtn: { flex: 1, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  cancelBtnText: { color: colors.textSecondary, fontWeight: "600" },
  confirmBtn: { flex: 1, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.success, alignItems: "center" },
  confirmBtnText: { color: "#fff", fontWeight: "700" },
});
