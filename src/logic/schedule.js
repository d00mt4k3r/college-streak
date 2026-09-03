// Эта функция отвечает на вопрос: "какие пары должны быть в такой-то день?"
// Порядок проверки:
// 1. Если на этот день есть "особый день" (праздник/больничный/особое расписание) — используем его.
// 2. Иначе берём шаблон недели (с учётом чередования) и смотрим пары по дню недели.

import { fromDateKey, weekDayKeyOf, mondayOf, weeksBetweenMondays, toDateKey } from "../utils/date";

// Находит, какой шаблон действует в неделю, содержащую date
export function getTemplateForDate(dateKey, data) {
  const { templates, scheduleSettings } = data;
  if (templates.length === 0) return null;

  if (scheduleSettings.mode === "single") {
    return templates.find((t) => t.id === scheduleSettings.activeTemplateId) || null;
  }

  // Режим чередования
  const { templateIds, anchorMonday } = scheduleSettings.rotation;
  if (!templateIds || templateIds.length === 0 || !anchorMonday) return null;

  const date = fromDateKey(dateKey);
  const currentMonday = mondayOf(date);
  const anchorMondayDate = fromDateKey(anchorMonday);

  const weeksPassed = weeksBetweenMondays(anchorMondayDate, currentMonday);
  // % в JS может давать отрицательный результат для отрицательных чисел — поправляем это
  const index = ((weeksPassed % templateIds.length) + templateIds.length) % templateIds.length;
  const templateId = templateIds[index];
  return templates.find((t) => t.id === templateId) || null;
}

// Возвращает описание дня: { kind: 'study'|'holiday'|'sick'|'none', lessons: [...] }
// lessons — массив пар вида { id, subjectId, startTime, endTime, order, room, teacher }
export function resolveDayPlan(dateKey, data) {
  const special = data.specialDays[dateKey];

  if (special) {
    if (special.type === "holiday") {
      return { kind: "holiday", lessons: [] };
    }
    if (special.type === "sick") {
      return { kind: "sick", lessons: [] };
    }
    if (special.type === "special") {
      const lessons = [...(special.lessons || [])].sort((a, b) => a.order - b.order);
      return { kind: lessons.length ? "study" : "none", lessons };
    }
  }

  const template = getTemplateForDate(dateKey, data);
  if (!template) return { kind: "none", lessons: [] };

  const dayKey = weekDayKeyOf(fromDateKey(dateKey));
  const lessons = [...(template.days[dayKey] || [])].sort((a, b) => a.order - b.order);
  return { kind: lessons.length ? "study" : "none", lessons };
}
