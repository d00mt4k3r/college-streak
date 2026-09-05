import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert, Share, Modal, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/useTheme";
import { spacing, radius } from "../src/constants/theme";
import AppIcon from "../src/components/AppIcon";
import Section from "../src/components/Section";
import SegmentedControl from "../src/components/SegmentedControl";
import HuePicker from "../src/components/HuePicker";
import PrimaryButton from "../src/components/PrimaryButton";
import { PRESET_COLORS } from "../src/theme/palette";
import { useI18n } from "../src/i18n";

const THEME_OPTIONS = ["system", "light", "dark"];

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data, ready, setThemeMode, setAccentColor, setLanguage, exportDataString, importDataString, resetAllData } = useApp();
  const { t } = useI18n();
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState("");

  if (!ready || !data) return null;

  const accentColor = data.settings.accentColor;

  const handleExport = async () => {
    const json = exportDataString();
    if (!json) return;
    try {
      await Share.share({ message: json });
    } catch (e) {
      Alert.alert(t("shareFailed"), t("tryAgain"));
    }
  };

  const handleImport = () => {
    const result = importDataString(importText);
    if (result.success) {
      setImportVisible(false);
      setImportText("");
      Alert.alert(t("done"), t("dataImported"));
    } else {
      Alert.alert(t("error"), result.error);
    }
  };

  const handleReset = () => {
    Alert.alert(
      t("resetTitle"),
      t("resetMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        { text: t("resetData"), style: "destructive", onPress: () => resetAllData() },
      ]
    );
  };

  const rowStyle = [styles.row, { borderBottomColor: theme.border }];
  const inputStyle = [styles.textArea, { backgroundColor: theme.surfaceSecondary, color: theme.text, borderColor: theme.border }];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
      <Section title={t("appearance")}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{t("language")}</Text>
        <SegmentedControl
          options={[{ value: "ru", label: t("russian") }, { value: "uk", label: t("ukrainian") }]}
          value={data.settings.language || "ru"}
          onChange={setLanguage}
        />

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: spacing.md }]}>{t("theme")}</Text>
        <SegmentedControl options={THEME_OPTIONS.map((value) => ({ value, label: t(value) }))} value={data.settings.themeMode} onChange={setThemeMode} />

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: spacing.md }]}>{t("accentColor")}</Text>
        <View style={styles.presetsRow}>
          {PRESET_COLORS.map((c) => (
            <Pressable key={c.value} onPress={() => setAccentColor(c.value)} style={styles.presetWrap}>
              <View style={[
                styles.presetSwatch,
                { backgroundColor: c.value, borderColor: accentColor === c.value ? theme.text : "transparent" },
              ]}>
                {accentColor === c.value && <AppIcon name="check" size={14} color="#FFFFFF" />}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: spacing.md }]}>{t("customColor")}</Text>
        <HuePicker value={accentColor} onChange={setAccentColor} />
      </Section>

      <Section title={t("schedule")}>
        <Pressable style={rowStyle} onPress={() => router.push("/schedule")}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>{t("scheduleAndTemplates")}</Text>
          <AppIcon name="chevronRight" size={16} color={theme.textSecondary} />
        </Pressable>
        <Pressable style={[rowStyle, { borderBottomWidth: 0 }]} onPress={() => router.push("/schedule/templates")}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>{t("weekTemplates")}</Text>
          <AppIcon name="chevronRight" size={16} color={theme.textSecondary} />
        </Pressable>
      </Section>

      <Section title={t("data")}>
        <Pressable style={rowStyle} onPress={handleExport}>
          <View style={styles.rowLeft}><AppIcon name="exportData" size={16} color={theme.textSecondary} /><Text style={[styles.rowLabel, { color: theme.text }]}>{t("exportData")}</Text></View>
        </Pressable>
        <Pressable style={rowStyle} onPress={() => setImportVisible(true)}>
          <View style={styles.rowLeft}><AppIcon name="importData" size={16} color={theme.textSecondary} /><Text style={[styles.rowLabel, { color: theme.text }]}>{t("importData")}</Text></View>
        </Pressable>
        <Pressable style={[rowStyle, { borderBottomWidth: 0 }]} onPress={handleReset}>
          <View style={styles.rowLeft}><AppIcon name="resetData" size={16} color={theme.error} /><Text style={[styles.rowLabel, { color: theme.error }]}>{t("resetData")}</Text></View>
        </Pressable>
      </Section>

      <Section title={t("about")}>
        <View style={styles.rowLeft}>
          <AppIcon name="info" size={16} color={theme.textSecondary} />
          <Text style={[styles.rowLabel, { color: theme.text }]}>College Streak · {t("version")} 1.0.0</Text>
        </View>
        <Pressable onPress={() => Linking.openURL("https://t.me/bugscollegestreak_bot")}>
          <Text style={[styles.botLink, { color: theme.primary }]}>{t("bugBot")}</Text>
        </Pressable>
      </Section>

      <Modal visible={importVisible} animationType="slide" transparent onRequestClose={() => setImportVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalContent}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>{t("importTitle")}</Text>
                <Text style={[styles.hint, { color: theme.textSecondary }]}> 
                  {t("importHint")}
                </Text>
                <TextInput
                  style={inputStyle}
                  placeholder={t("pasteJson")}
                  placeholderTextColor={theme.textSecondary}
                  value={importText}
                  onChangeText={setImportText}
                  multiline
                  numberOfLines={8}
                />
                <View style={styles.modalButtons}>
                  <Pressable style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setImportVisible(false)}>
                    <Text style={{ color: theme.textSecondary, fontWeight: "700" }}>{t("cancel")}</Text>
                  </Pressable>
                  <View style={{ flex: 2 }}>
                    <PrimaryButton label={t("import")} onPress={handleImport} />
                  </View>
                </View>
              </ScrollView>
              </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "700", marginBottom: spacing.sm, textTransform: "uppercase", letterSpacing: 0.5 },
  presetsRow: { flexDirection: "row", gap: spacing.sm },
  presetWrap: { padding: 2 },
  presetSwatch: { width: 34, height: 34, borderRadius: radius.md, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rowLabel: { fontSize: 14, fontWeight: "600" },
  botLink: { fontSize: 14, fontWeight: "600", marginTop: spacing.sm },
  hint: { fontSize: 12, marginBottom: spacing.sm, lineHeight: 17 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: spacing.lg },
  keyboardAvoidingView: { width: "100%", maxHeight: "90%" },
  modalCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, maxHeight: "100%" },
  modalContent: { flexGrow: 1 },
  modalTitle: { fontSize: 17, fontWeight: "800", marginBottom: spacing.xs },
  textArea: { borderRadius: radius.md, borderWidth: 1, padding: spacing.sm, minHeight: 140, textAlignVertical: "top", fontSize: 12 },
  modalButtons: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  cancelBtn: { flex: 1, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
