// Простой список достижений. Никаких уровней, валюты и магазина — как и просили.

export const ACHIEVEMENTS_LIST = [
  { id: "streak_3", icon: "🥉", title: "3 дня подряд", check: (s) => s.bestStreak >= 3 },
  { id: "streak_7", icon: "🥈", title: "7 дней подряд", check: (s) => s.bestStreak >= 7 },
  { id: "streak_30", icon: "🥇", title: "30 дней подряд", check: (s) => s.bestStreak >= 30 },
  { id: "streak_50", icon: "🔥", title: "50 дней подряд", check: (s) => s.bestStreak >= 50 },
  { id: "tasks_10", icon: "📚", title: "Выполнить 10 заданий", check: (s, tasksDone) => tasksDone >= 10 },
  { id: "tasks_50", icon: "📚", title: "Выполнить 50 заданий", check: (s, tasksDone) => tasksDone >= 50 },
  { id: "lessons_100", icon: "🎓", title: "Посетить 100 пар", check: (s) => s.lessonsAttended >= 100 },
];

export function countCompletedTasks(data) {
  let count = 0;
  Object.values(data.tasks).forEach((list) => {
    count += list.filter((t) => t.done).length;
  });
  return count;
}

// Проверяет все условия и возвращает обновлённый список разблокированных id (без дублей)
export function checkAchievements(data) {
  const tasksDone = countCompletedTasks(data);
  const unlocked = new Set(data.achievements || []);

  ACHIEVEMENTS_LIST.forEach((a) => {
    if (!unlocked.has(a.id) && a.check(data.stats, tasksDone)) {
      unlocked.add(a.id);
    }
  });

  return Array.from(unlocked);
}
