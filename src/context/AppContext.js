// Единый контекст приложения. Любой экран берёт данные и функции отсюда через useApp().
// Так мы не тащим AsyncStorage в каждый компонент — вся работа с хранилищем в одном месте.

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loadData, saveData, generateId } from "../storage/storage";
import { toggleLessonAttendance, markDaySick, markDayHoliday, reopenDay, ensureAttendanceEntry } from "../logic/streakLogic";
import { checkAchievements } from "../logic/achievements";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(null); // null = ещё загружается
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadData().then((loaded) => {
      setData(loaded);
      setReady(true);
    });
  }, []);

  // Сохраняем данные при каждом изменении (после того как приложение уже загрузилось)
  useEffect(() => {
    if (ready && data) {
      saveData(data);
    }
  }, [data, ready]);

  // Универсальный помощник: применяет функцию-трансформацию к data и сохраняет результат
  const update = useCallback((fn) => {
    setData((prev) => fn(prev));
  }, []);

  // ---------- ПРЕДМЕТЫ ----------
  const addSubject = (name) => update((prev) => ({
    ...prev,
    subjects: [...prev.subjects, { id: generateId(), name }],
  }));

  const renameSubject = (id, name) => update((prev) => ({
    ...prev,
    subjects: prev.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
  }));

  const deleteSubject = (id) => update((prev) => {
    const nextTasks = { ...prev.tasks };
    delete nextTasks[id];
    return { ...prev, subjects: prev.subjects.filter((s) => s.id !== id), tasks: nextTasks };
  });

  // ---------- ЗАДАНИЯ ----------
  const addTask = (subjectId, title) => update((prev) => {
    const list = prev.tasks[subjectId] || [];
    return { ...prev, tasks: { ...prev.tasks, [subjectId]: [...list, { id: generateId(), title, done: false }] } };
  });

  const toggleTask = (subjectId, taskId) => update((prev) => {
    const list = prev.tasks[subjectId] || [];
    const nextList = list.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    const nextData = { ...prev, tasks: { ...prev.tasks, [subjectId]: nextList } };
    nextData.achievements = checkAchievements(nextData);
    return nextData;
  });

  const renameTask = (subjectId, taskId, title) => update((prev) => {
    const list = prev.tasks[subjectId] || [];
    return { ...prev, tasks: { ...prev.tasks, [subjectId]: list.map((t) => (t.id === taskId ? { ...t, title } : t)) } };
  });

  const deleteTask = (subjectId, taskId) => update((prev) => {
    const list = prev.tasks[subjectId] || [];
    return { ...prev, tasks: { ...prev.tasks, [subjectId]: list.filter((t) => t.id !== taskId) } };
  });

  // ---------- ШАБЛОНЫ РАСПИСАНИЯ ----------
  const addTemplate = (name) => update((prev) => ({
    ...prev,
    templates: [...prev.templates, {
      id: generateId(),
      name,
      days: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
    }],
  }));

  const deleteTemplate = (id) => update((prev) => {
    const nextSettings = { ...prev.scheduleSettings };
    if (nextSettings.activeTemplateId === id) nextSettings.activeTemplateId = null;
    nextSettings.rotation = {
      ...nextSettings.rotation,
      templateIds: nextSettings.rotation.templateIds.filter((tid) => tid !== id),
    };
    return { ...prev, templates: prev.templates.filter((t) => t.id !== id), scheduleSettings: nextSettings };
  });

  const renameTemplate = (id, name) => update((prev) => ({
    ...prev,
    templates: prev.templates.map((t) => (t.id === id ? { ...t, name } : t)),
  }));

  // lesson: { subjectId, startTime, endTime, room, teacher }
  const addLesson = (templateId, dayKey, lesson) => update((prev) => ({
    ...prev,
    templates: prev.templates.map((t) => {
      if (t.id !== templateId) return t;
      const dayLessons = t.days[dayKey] || [];
      const newLesson = { id: generateId(), order: dayLessons.length + 1, ...lesson };
      return { ...t, days: { ...t.days, [dayKey]: [...dayLessons, newLesson] } };
    }),
  }));

  const updateLesson = (templateId, dayKey, lessonId, changes) => update((prev) => ({
    ...prev,
    templates: prev.templates.map((t) => {
      if (t.id !== templateId) return t;
      const dayLessons = (t.days[dayKey] || []).map((l) => (l.id === lessonId ? { ...l, ...changes } : l));
      return { ...t, days: { ...t.days, [dayKey]: dayLessons } };
    }),
  }));

  const deleteLesson = (templateId, dayKey, lessonId) => update((prev) => ({
    ...prev,
    templates: prev.templates.map((t) => {
      if (t.id !== templateId) return t;
      const dayLessons = (t.days[dayKey] || [])
        .filter((l) => l.id !== lessonId)
        .map((l, idx) => ({ ...l, order: idx + 1 }));
      return { ...t, days: { ...t.days, [dayKey]: dayLessons } };
    }),
  }));

  const moveLesson = (templateId, dayKey, lessonId, direction) => update((prev) => ({
    ...prev,
    templates: prev.templates.map((t) => {
      if (t.id !== templateId) return t;
      const list = [...(t.days[dayKey] || [])].sort((a, b) => a.order - b.order);
      const idx = list.findIndex((l) => l.id === lessonId);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= list.length) return t;
      [list[idx], list[swapWith]] = [list[swapWith], list[idx]];
      const reordered = list.map((l, i) => ({ ...l, order: i + 1 }));
      return { ...t, days: { ...t.days, [dayKey]: reordered } };
    }),
  }));

  // ---------- НАСТРОЙКИ РАСПИСАНИЯ (одиночный шаблон / чередование) ----------
  const setSingleTemplate = (templateId) => update((prev) => ({
    ...prev,
    scheduleSettings: { ...prev.scheduleSettings, mode: "single", activeTemplateId: templateId },
  }));

  const setRotation = (templateIds, anchorMonday) => update((prev) => ({
    ...prev,
    scheduleSettings: { ...prev.scheduleSettings, mode: "rotation", rotation: { templateIds, anchorMonday } },
  }));

  // ---------- ДЕЙСТВИЯ СО ДНЁМ (стрик) ----------
  const setLessonAttendance = (dateKey, lessonIndex, value) => update((prev) => toggleLessonAttendance(prev, dateKey, lessonIndex, value));

  const setDaySick = (dateKey) => update((prev) => markDaySick(prev, dateKey));
  const setDayHoliday = (dateKey) => update((prev) => markDayHoliday(prev, dateKey));
  const reopenDayAction = (dateKey) => update((prev) => reopenDay(prev, dateKey));

  // Устанавливает особое расписание (только для конкретного дня, шаблон не трогается)
  const setSpecialSchedule = (dateKey, lessons) => update((prev) => {
    const next = { ...prev, specialDays: { ...prev.specialDays, [dateKey]: { type: "special", lessons } } };
    delete next.attendance[dateKey];
    return next;
  });

  const getDayEntry = useCallback((dateKey) => {
    if (!data) return null;
    return data.attendance[dateKey] || ensureAttendanceEntry(data, dateKey);
  }, [data]);

  const finishOnboarding = () => update((prev) => ({ ...prev, meta: { ...prev.meta, firstLaunchDone: true } }));

  const value = {
    data,
    ready,
    addSubject, renameSubject, deleteSubject,
    addTask, toggleTask, renameTask, deleteTask,
    addTemplate, deleteTemplate, renameTemplate,
    addLesson, updateLesson, deleteLesson, moveLesson,
    setSingleTemplate, setRotation,
    setLessonAttendance, setDaySick, setDayHoliday, reopenDayAction, setSpecialSchedule,
    getDayEntry,
    finishOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp должен использоваться внутри <AppProvider>");
  return ctx;
}
