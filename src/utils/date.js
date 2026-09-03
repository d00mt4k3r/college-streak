// Все функции для дат собраны здесь, чтобы не путаться в разных местах кода.

import { weekDays } from "../constants/theme";

// Превращает дату в строку формата "2026-09-03" — именно так мы храним даты
// в качестве ключей объектов (attendance, specialDays и т.д.)
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function fromDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// JS: getDay() возвращает 0 для воскресенья. Нам удобнее понедельник первым днём.
const JS_DAY_TO_KEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function weekDayKeyOf(date) {
  return JS_DAY_TO_KEY[date.getDay()];
}

export function weekDayLabel(key) {
  const found = weekDays.find((d) => d.key === key);
  return found ? found.label : key;
}

// Возвращает дату понедельника той недели, в которую входит date
export function mondayOf(date) {
  const d = new Date(date);
  const jsDay = d.getDay(); // 0..6, 0 = воскресенье
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Сколько целых недель прошло между двумя понедельниками
export function weeksBetweenMondays(mondayA, mondayB) {
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round((mondayB.getTime() - mondayA.getTime()) / msInWeek);
}

export function formatHuman(dateKey) {
  const date = fromDateKey(dateKey);
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

// Возвращает массив дат-ключей для календарной сетки месяца (включая "хвосты" соседних месяцев)
export function getMonthGrid(year, monthIndex) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = (weekDayKeyOf(firstOfMonth) === "mon") ? 0 :
    JS_DAY_TO_KEY.indexOf(weekDayKeyOf(firstOfMonth)) === 0 ? 6 :
    JS_DAY_TO_KEY.indexOf(weekDayKeyOf(firstOfMonth)) - 1;

  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - startOffset);

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push({
      key: toDateKey(d),
      inMonth: d.getMonth() === monthIndex,
      dayNumber: d.getDate(),
    });
  }
  return days;
}
