// Здесь живёт вся логика стрика. Специально вынесена в отдельный файл,
// чтобы экраны (UI) не содержали сложных вычислений — только вызывали эти функции.
//
// ВАЖНОЕ УПРОЩЕНИЕ (см. пункт 17 задания):
// Стрик автоматически пересчитывается только для того дня, который пользователь
// закрывает (обычно это "сегодня"). Если пользователь редактирует прошедший день
// через календарь, день сначала "переоткрывается" (эффект на статистику отменяется),
// а затем при повторном закрытии — применяется заново. Это самый простой вариант,
// который легко понять и поддерживать.

import { resolveDayPlan } from "./schedule";
import { checkAchievements } from "./achievements";

// Готовит (или возвращает существующую) запись посещаемости для дня
export function ensureAttendanceEntry(data, dateKey) {
  if (data.attendance[dateKey]) return data.attendance[dateKey];

  const plan = resolveDayPlan(dateKey, data);

  if (plan.kind === "none" || plan.kind === "holiday") {
    return { lessons: [], status: plan.kind === "holiday" ? "holiday" : "none", closed: plan.kind === "holiday" };
  }
  if (plan.kind === "sick") {
    return { lessons: [], status: "sick", closed: true };
  }

  // Обычный учебный день — создаём список пар с ещё не проставленной отметкой
  const lessons = plan.lessons.map((l) => ({
    lessonId: l.id,
    subjectId: l.subjectId,
    startTime: l.startTime,
    endTime: l.endTime,
    attended: null, // null = ещё не отмечено, true = был, false = пропустил
  }));

  return { lessons, status: "pending", closed: false };
}

// Отменяет влияние уже закрытого дня на статистику и стрик (используется перед изменением)
function revertDayEffects(data, entry) {
  const stats = { ...data.stats };

  if (entry.status === "complete") {
    stats.currentStreak = Math.max(0, stats.currentStreak - 1);
    stats.daysAttended = Math.max(0, stats.daysAttended - 1);
    const attendedCount = entry.lessons.filter((l) => l.attended === true).length;
    stats.lessonsAttended = Math.max(0, stats.lessonsAttended - attendedCount);
  } else if (entry.status === "incomplete") {
    stats.daysMissed = Math.max(0, stats.daysMissed - 1);
    const attendedCount = entry.lessons.filter((l) => l.attended === true).length;
    const missedCount = entry.lessons.filter((l) => l.attended === false).length;
    stats.lessonsAttended = Math.max(0, stats.lessonsAttended - attendedCount);
    stats.lessonsMissed = Math.max(0, stats.lessonsMissed - missedCount);
  }
  // sick / holiday / pending — на статистику не влияли, откатывать нечего

  return stats;
}

// Применяет эффект дня на статистику после того как он закрыт
function applyDayEffects(stats, entry) {
  const next = { ...stats };

  if (entry.status === "complete") {
    next.currentStreak += 1;
    if (next.currentStreak > next.bestStreak) next.bestStreak = next.currentStreak;
    next.daysAttended += 1;
    next.lessonsAttended += entry.lessons.length;
  } else if (entry.status === "incomplete") {
    next.currentStreak = 0;
    next.daysMissed += 1;
    const attendedCount = entry.lessons.filter((l) => l.attended === true).length;
    const missedCount = entry.lessons.filter((l) => l.attended === false).length;
    next.lessonsAttended += attendedCount;
    next.lessonsMissed += missedCount;
  }
  // sick / holiday — не меняют статистику, день просто "замораживается"

  return next;
}

// Отмечает конкретную пару как посещённую/пропущенную/не отмеченную (цикл: null -> true -> false -> null)
export function toggleLessonAttendance(data, dateKey, lessonIndex, value) {
  const newData = JSON.parse(JSON.stringify(data));
  let entry = newData.attendance[dateKey] || ensureAttendanceEntry(newData, dateKey);

  if (entry.closed) return newData; // закрытый день сначала нужно переоткрыть

  entry = { ...entry, lessons: entry.lessons.map((l, i) => (i === lessonIndex ? { ...l, attended: value } : l)) };
  newData.attendance[dateKey] = entry;

  // Проверяем, все ли пары отмечены — если да, закрываем день автоматически
  const allMarked = entry.lessons.every((l) => l.attended !== null);
  if (allMarked && entry.lessons.length > 0) {
    const allAttended = entry.lessons.every((l) => l.attended === true);
    entry.status = allAttended ? "complete" : "incomplete";
    entry.closed = true;
    newData.stats = applyDayEffects(newData.stats, entry);
    newData.achievements = checkAchievements(newData);
  }

  return newData;
}

// Отмечает день как больничный
export function markDaySick(data, dateKey) {
  const newData = JSON.parse(JSON.stringify(data));
  const existing = newData.attendance[dateKey];

  if (existing && existing.closed) {
    newData.stats = revertDayEffects(newData, existing);
  }

  newData.attendance[dateKey] = { lessons: existing ? existing.lessons : [], status: "sick", closed: true };
  newData.specialDays[dateKey] = { type: "sick" };
  return newData;
}

// Отмечает день как праздник/выходной (не учебный)
export function markDayHoliday(data, dateKey) {
  const newData = JSON.parse(JSON.stringify(data));
  const existing = newData.attendance[dateKey];

  if (existing && existing.closed) {
    newData.stats = revertDayEffects(newData, existing);
  }

  newData.attendance[dateKey] = { lessons: [], status: "holiday", closed: true };
  newData.specialDays[dateKey] = { type: "holiday" };
  return newData;
}

// Возвращает день обратно в обычный учебный режим и переоткрывает его для редактирования
export function reopenDay(data, dateKey) {
  const newData = JSON.parse(JSON.stringify(data));
  const existing = newData.attendance[dateKey];

  if (existing && existing.closed) {
    newData.stats = revertDayEffects(newData, existing);
  }

  delete newData.specialDays[dateKey];
  delete newData.attendance[dateKey];
  newData.attendance[dateKey] = ensureAttendanceEntry(newData, dateKey);
  return newData;
}
