// Всё приложение хранит данные ОДНИМ большим JSON-объектом под одним ключом.
// Это проще для понимания: одна функция читает всё, одна функция сохраняет всё.
// Для личного приложения такого объёма (не тысячи записей) этого достаточно.

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "college-streak-data-v1";

// Структура данных "с нуля" — используется при первом запуске приложения
export function createEmptyData() {
  return {
    meta: {
      firstLaunchDone: false,
    },
    subjects: [], // [{ id, name }]
    templates: [], // [{ id, name, days: { mon: [], tue: [], ... } }]
    scheduleSettings: {
      mode: "single", // "single" | "rotation"
      activeTemplateId: null,
      rotation: {
        templateIds: [], // порядок чередования шаблонов
        anchorMonday: null, // ключ даты понедельника, с которого начинается chередование
      },
    },
    specialDays: {}, // { "2026-09-16": { type: "holiday" | "sick" | "special", lessons?: [...] } }
    attendance: {}, // { "2026-09-03": { lessons: [...], status, closed } }
    tasks: {}, // { subjectId: [{ id, title, done }] }
    stats: {
      currentStreak: 0,
      bestStreak: 0,
      daysAttended: 0,
      daysMissed: 0,
      lessonsAttended: 0,
      lessonsMissed: 0,
    },
    achievements: [], // список id разблокированных достижений
  };
}

export async function loadData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyData();
    const parsed = JSON.parse(raw);
    // На случай если в старых версиях приложения не было какого-то поля —
    // подстраховываемся значениями по умолчанию.
    return { ...createEmptyData(), ...parsed };
  } catch (e) {
    console.warn("Не удалось прочитать данные из хранилища:", e);
    return createEmptyData();
  }
}

export async function saveData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Не удалось сохранить данные:", e);
  }
}

// Простой генератор id, без внешних библиотек
export function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
