import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

// attended: null | true | false
export default function LessonRow({ subjectName, startTime, endTime, room, teacher, attended, onMark, disabled }) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.time}>{startTime} – {endTime}</Text>
        <Text style={styles.subject}>{subjectName}</Text>
        {(room || teacher) ? (
          <Text style={styles.meta}>{[room, teacher].filter(Boolean).join(" · ")}</Text>
        ) : null}
      </View>
      <View style={styles.buttons}>
        <Pressable
          disabled={disabled}
          onPress={() => onMark(attended === true ? null : true)}
          style={[styles.btn, attended === true && styles.btnActiveGood]}
        >
          <Text style={styles.btnText}>✅</Text>
        </Pressable>
        <Pressable
          disabled={disabled}
          onPress={() => onMark(attended === false ? null : false)}
          style={[styles.btn, attended === false && styles.btnActiveBad]}
        >
          <Text style={styles.btnText}>❌</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, paddingRight: spacing.sm },
  time: { color: colors.textSecondary, fontSize: 12 },
  subject: { color: colors.textPrimary, fontSize: 16, fontWeight: "600", marginTop: 2 },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  buttons: { flexDirection: "row", gap: spacing.xs },
  btn: {
    width: 40, height: 40, borderRadius: radius.sm,
    alignItems: "center", justifyContent: "center",
    backgroundColor: colors.cardAlt,
  },
  btnActiveGood: { backgroundColor: colors.success },
  btnActiveBad: { backgroundColor: colors.danger },
  btnText: { fontSize: 18 },
});
