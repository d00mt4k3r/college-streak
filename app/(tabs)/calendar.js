import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { colors, spacing, weekDays } from "../../src/constants/theme";
import DayCell from "../../src/components/DayCell";
import { getMonthGrid, todayKey } from "../../src/utils/date";

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export default function CalendarScreen() {
  const router = useRouter();
  const { data, ready } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  if (!ready || !data) return null;

  const grid = getMonthGrid(year, month);
  const today = todayKey();

  const statusFor = (dateKey) => {
    const existing = data.attendance[dateKey];
    if (existing) return existing.status === "pending" || existing.status === "none" ? null : existing.status;
    // Для дней без записи не считаем статус, чтобы не плодить лишние вычисления на будущие даты
    return null;
  };

  const goPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const goNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <View style={styles.header}>
        <Pressable onPress={goPrevMonth}><Text style={styles.nav}>‹</Text></Pressable>
        <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
        <Pressable onPress={goNextMonth}><Text style={styles.nav}>›</Text></Pressable>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((d) => <Text key={d.key} style={styles.weekLabel}>{d.short}</Text>)}
      </View>

      <View style={styles.grid}>
        {grid.map((cell) => (
          <DayCell
            key={cell.key}
            dayNumber={cell.dayNumber}
            inMonth={cell.inMonth}
            isToday={cell.key === today}
            status={statusFor(cell.key)}
            onPress={() => router.push(`/day/${cell.key}`)}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendItem}>🟩 Все пары посещены</Text>
        <Text style={styles.legendItem}>🟥 Был прогул</Text>
        <Text style={styles.legendItem}>🏥 Больничный</Text>
        <Text style={styles.legendItem}>🎉 Выходной / праздник</Text>
        <Text style={styles.legendItem}>⬜ Нет данных / не учебный день</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  nav: { color: colors.textPrimary, fontSize: 28, paddingHorizontal: spacing.md },
  monthTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "700" },
  weekRow: { flexDirection: "row", marginBottom: spacing.xs },
  weekLabel: { width: `${100 / 7}%`, textAlign: "center", color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  legend: { marginTop: spacing.lg, gap: spacing.xs },
  legendItem: { color: colors.textSecondary, fontSize: 13 },
});
