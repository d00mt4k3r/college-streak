// ЭТО ЕДИНСТВЕННЫЙ ФАЙЛ, КОТОРЫЙ НУЖНО ПРАВИТЬ, ЧТОБЫ ДОБАВИТЬ НОВОЕ ДОСТИЖЕНИЕ.
// Логика проверки (src/logic/achievements.js) ничего не знает о конкретных
// достижениях — она просто проходит по этому списку и проверяет условие (condition).
//
// ИКОНКА ДОСТИЖЕНИЯ:
// По умолчанию используется поле icon — это ключ из реестра src/config/icons.js
// (например "streak", "book", "gacha"). Если хочешь показать СВОЮ картинку вместо
// стандартной иконки — добавь поле image, и оно будет иметь приоритет:
//   {
//     id: "streak_30",
//     title: "Месяц без пропусков",
//     icon: "streak",                                  // обычная иконка (используется по умолчанию)
//     image: require("../../assets/achievements/streak_30.png"), // если добавишь — покажется она
//     ...
//   }
// Если файл картинки не найден — приложение не упадёт, а покажет обычную иконку.
//
// КАК ДОБАВИТЬ НОВОЕ ДОСТИЖЕНИЕ:
// 1. Скопируй любой объект ниже.
// 2. Поменяй id (должен быть уникальным), title, description, icon, category.
// 3. Укажи rewardXP — сколько опыта дать за это достижение.
// 4. Укажи condition — тип условия и (если нужно) число, при достижении которого
//    достижение засчитывается. Доступные типы условий смотри в комментарии внизу файла.
// 5. Сохрани файл — достижение сразу появится на экране "Достижения" и будет
//    проверяться автоматически.
//
// Менять компоненты экранов для этого не нужно.

export const ACHIEVEMENTS = [
  // ==================== 🔥 СТРИК ====================
  { id: "streak_1", title: "Первый шаг", description: "Продержаться 1 учебный день подряд", icon: "streak", category: "streak", rewardXP: 10, condition: { type: "streakBest", value: 1 } },
  { id: "streak_3", title: "Главное — ввязаться", description: "Продержаться 3 дня подряд", icon: "streak", category: "streak", rewardXP: 20, condition: { type: "streakBest", value: 3 } },
  { id: "streak_5", title: "Это мы одобряем", description: "Продержаться 5 дней подряд", icon: "streak", category: "streak", rewardXP: 30, condition: { type: "streakBest", value: 5 } },
  { id: "streak_7", title: "Выжил в будни", description: "Продержаться 7 дней подряд", icon: "streak", category: "streak", rewardXP: 50, condition: { type: "streakBest", value: 7 } },
  { id: "streak_10", title: "Стабильный перформанс", description: "Продержаться 10 дней подряд", icon: "streak", category: "streak", rewardXP: 75, condition: { type: "streakBest", value: 10 } },
  { id: "streak_14", title: "Две недели без фокусов", description: "Продержаться 14 дней подряд", icon: "streak", category: "streak", rewardXP: 100, condition: { type: "streakBest", value: 14 } },
  { id: "streak_21", title: "Однажды", description: "Продержаться 21 день подряд", icon: "streak", category: "streak", rewardXP: 150, condition: { type: "streakBest", value: 21 } },
  { id: "streak_30", title: "Режим терминатора", description: "Продержаться 30 учебных дней подряд", icon: "streak", category: "streak", rewardXP: 200, condition: { type: "streakBest", value: 30 } },
  { id: "streak_50", title: "Подозрительно стабильно", description: "Продержаться 50 дней подряд", icon: "streak", category: "streak", rewardXP: 300, condition: { type: "streakBest", value: 50 } },
  { id: "streak_75", title: "Автопилот активирован", description: "Продержаться 75 дней подряд", icon: "streak", category: "streak", rewardXP: 400, condition: { type: "streakBest", value: 75 } },
  { id: "streak_100", title: "Ни единого разрыва", description: "Продержаться 100 дней подряд", icon: "streak", category: "streak", rewardXP: 500, condition: { type: "streakBest", value: 100 } },
  { id: "streak_150", title: "Стержень из титана", description: "Продержаться 150 дней подряд", icon: "streak", category: "streak", rewardXP: 700, condition: { type: "streakBest", value: 150 } },
  { id: "streak_200", title: "Победитель по жизни", description: "Продержаться 200 дней подряд", icon: "streak", category: "streak", rewardXP: 1000, condition: { type: "streakBest", value: 200 } },

  // ==================== 🎓 ПОСЕЩАЕМОСТЬ ====================
  { id: "lessons_10", title: "Случайный свидетель", description: "Посетить 10 пар", icon: "attendance", category: "attendance", rewardXP: 15, condition: { type: "lessonsAttended", value: 10 } },
  { id: "lessons_25", title: "План капкан работает", description: "Посетить 25 пар", icon: "attendance", category: "attendance", rewardXP: 30, condition: { type: "lessonsAttended", value: 25 } },
  { id: "lessons_50", title: "Аватар аудитории", description: "Посетить 50 пар", icon: "attendance", category: "attendance", rewardXP: 60, condition: { type: "lessonsAttended", value: 50 } },
  { id: "lessons_100", title: "Мебель первой парты", description: "Посетить 100 пар", icon: "attendance", category: "attendance", rewardXP: 100, condition: { type: "lessonsAttended", value: 100 } },
  { id: "lessons_250", title: "Постоянный жилец", description: "Посетить 250 пар", icon: "attendance", category: "attendance", rewardXP: 200, condition: { type: "lessonsAttended", value: 250 } },
  { id: "lessons_500", title: "Корректный арендатор", description: "Посетить 500 пар", icon: "attendance", category: "attendance", rewardXP: 350, condition: { type: "lessonsAttended", value: 500 } },
  { id: "lessons_1000", title: "Часть корабля, часть команды", description: "Посетить 1000 пар", icon: "attendance", category: "attendance", rewardXP: 600, condition: { type: "lessonsAttended", value: 1000 } },

  // ==================== 📚 ЗАДАНИЯ ====================
  { id: "tasks_1", title: "Начало положено", description: "Выполнить 1 задание", icon: "book", category: "tasks", rewardXP: 10, condition: { type: "tasksCompleted", value: 1 } },
  { id: "tasks_5", title: "Прогресс налицо", description: "Выполнить 10 заданий", icon: "book", category: "tasks", rewardXP: 25, condition: { type: "tasksCompleted", value: 10 } },
  { id: "tasks_10", title: "Анжумання 10 раз", description: "Выполнить 30 заданий", icon: "book", category: "tasks", rewardXP: 50, condition: { type: "tasksCompleted", value: 30 } },
  { id: "tasks_25", title: "Не много, не мало", description: "Выполнить 50 заданий", icon: "book", category: "tasks", rewardXP: 90, condition: { type: "tasksCompleted", value: 50 } },
  { id: "tasks_50", title: "Работы непочатый край", description: "Выполнить 70 заданий", icon: "book", category: "tasks", rewardXP: 150, condition: { type: "tasksCompleted", value: 70 } },
  { id: "tasks_100", title: "Машина без тормозов", description: "Выполнить 100 заданий", icon: "book", category: "tasks", rewardXP: 250, condition: { type: "tasksCompleted", value: 100 } },
  { id: "tasks_250", title: "Power and motivation", description: "Выполнить 250 заданий", icon: "book", category: "tasks", rewardXP: 500, condition: { type: "tasksCompleted", value: 250 } },
  { id: "tasks_subject_all", title: "По надмозгам во всех сферах", description: "Выполнить хотя бы одно задание по каждому предмету", icon: "notebook", category: "tasks", rewardXP: 80, condition: { type: "subjectsAllHaveTaskDone" } },

  // ==================== 💯 ИДЕАЛЬНЫЙ ДЕНЬ ====================
  { id: "perfect_day_1", title: "Сегодня без происшествий", description: "Один день без пропусков", icon: "perfectDay", category: "perfect_day", rewardXP: 15, condition: { type: "perfectDaysTotal", value: 1 } },
  { id: "perfect_day_3", title: "Хет-трик", description: "3 идеальных учебных дня", icon: "perfectDay", category: "perfect_day", rewardXP: 30, condition: { type: "perfectDaysTotal", value: 3 } },
  { id: "perfect_day_7", title: "Неделька удалась", description: "7 идеальных учебных дней", icon: "perfectDay", category: "perfect_day", rewardXP: 60, condition: { type: "perfectDaysTotal", value: 7 } },
  { id: "perfect_day_10", title: "Эстетика безупречности", description: "10 идеальных учебных дней", icon: "perfectDay", category: "perfect_day", rewardXP: 90, condition: { type: "perfectDaysTotal", value: 10 } },
  { id: "perfect_day_30", title: "Без сучка и задоринки", description: "30 идеальных учебных дней", icon: "perfectDay", category: "perfect_day", rewardXP: 200, condition: { type: "perfectDaysTotal", value: 30 } },

  // ==================== 📅 КАЛЕНДАРЬ ====================
  { id: "calendar_week", title: "Превозмогание и точка", description: "Пройти целую учебную неделю без единого пропуска", icon: "calendarCheck", category: "calendar", rewardXP: 70, condition: { type: "perfectWeeksTotal", value: 1 } },
  { id: "calendar_weeks_row", title: "Чиназес", description: "Две идеальные недели подряд", icon: "calendarCheck", category: "calendar", rewardXP: 150, condition: { type: "consecutivePerfectWeeks", value: 2 } },
  { id: "calendar_month_perfect", title: "Планы Наполеона", description: "Пройти целый календарный месяц без единого пропуска", icon: "calendarCheck", category: "calendar", rewardXP: 250, condition: { type: "perfectMonthsTotal", value: 1 } },
  { id: "calendar_month_done", title: "Дорогие друзья, сисимасиси", description: "Довести отслеживание до конца года", icon: "calendarCheck", category: "calendar", rewardXP: 50, condition: { type: "yearEndTracked" } },

  // ==================== 🏥 ВОССТАНОВЛЕНИЕ ====================
  { id: "recovery_back", title: "И восстали машины из пепла ядерного огня", description: "Вернуться после больничного и успешно закрыть первый учебный день", icon: "sick", category: "recovery", rewardXP: 40, condition: { type: "comebackCount", value: 1 } },
  { id: "recovery_veteran", title: "Стойкий боец", description: "Успешно вернуться к учёбе после больничного 3 раза", icon: "sick", category: "recovery", rewardXP: 100, condition: { type: "comebackCount", value: 3 } },

  // ==================== 📝 ПРЕДМЕТЫ ====================
  { id: "subject_first", title: "Начало расследования", description: "Создать первый предмет", icon: "notebook", category: "subjects", rewardXP: 10, condition: { type: "subjectsCount", value: 1 } },
  { id: "subject_five", title: "Скрытопул", description: "Добавить 5 предметов", icon: "notebook", category: "subjects", rewardXP: 40, condition: { type: "subjectsCount", value: 5 } },
  { id: "subject_close_one", title: "Пока ты без дел", description: "Полностью выполнить все задания одного предмета", icon: "notebook", category: "subjects", rewardXP: 80, condition: { type: "subjectsFullyCompleted", value: 1 } },
  { id: "subject_close_three", title: "Из князи в грязи", description: "Полностью закрыть 3 предмета", icon: "notebook", category: "subjects", rewardXP: 200, condition: { type: "subjectsFullyCompleted", value: 3 } },

  // ==================== 🎰 ГАЧА ====================
  { id: "gacha_first_roll", title: "Закинул удочку", description: "Сделать первую крутку в гаче", icon: "gacha", category: "gacha", rewardXP: 20, condition: { type: "gachaRollsTotal", value: 1 } },
  { id: "gacha_first_5star", title: "Повезло-повезло", description: "Получить первую карточку 5★", icon: "star", category: "gacha", rewardXP: 100, condition: { type: "gotRarity5" } },
  { id: "gacha_5_unique", title: "Лудомания", description: "Получить 5 разных карточек", icon: "gacha", category: "gacha", rewardXP: 40, condition: { type: "uniqueCardsCount", value: 5 } },
  { id: "gacha_10_unique", title: "Безпочечный", description: "Получить 10 разных карточек", icon: "gacha", category: "gacha", rewardXP: 80, condition: { type: "uniqueCardsCount", value: 10 } },
  { id: "gacha_half_collection", title: "Разнообразный колорит", description: "Собрать половину коллекции карточек", icon: "collection", category: "gacha", rewardXP: 150, condition: { type: "collectionHalf" } },
  { id: "gacha_full_collection", title: "Absolute Cinema", description: "Собрать все карточки", icon: "achievement", category: "gacha", rewardXP: 400, condition: { type: "collectionComplete" } },
  { id: "gacha_duplicate", title: "Double life", description: "Получить повторную карточку", icon: "reopen", category: "gacha", rewardXP: 10, condition: { type: "anyDuplicate" } },
  { id: "gacha_triple_duplicate", title: "Три в ряд", description: "Получить 3 копии одной карточки", icon: "reopen", category: "gacha", rewardXP: 50, condition: { type: "duplicateOfSameCard", value: 3 } },

  // ==================== ✨ XP ====================
  { id: "xp_first_100", title: "Деньги любят счет", description: "Заработать первые 100 XP за всё время", icon: "xp", category: "xp", rewardXP: 20, condition: { type: "totalXPEarned", value: 100 } },
  { id: "xp_accumulate_500", title: "Финансовая подушка безопасности", description: "Накопить 500 XP на балансе", icon: "xp", category: "xp", rewardXP: 50, condition: { type: "currentXP", value: 500 } },
  { id: "xp_accumulate_1000", title: "Тысяча от Зеленского", description: "Накопить 1000 XP на балансе", icon: "xp", category: "xp", rewardXP: 100, condition: { type: "currentXP", value: 1000 } },
  { id: "xp_total_5000", title: "Пасивный доход", description: "Заработать 5000 XP за всё время", icon: "xp", category: "xp", rewardXP: 300, condition: { type: "totalXPEarned", value: 5000 } },
];

// ---------------------------------------------------------------------------
// СПРАВКА: доступные типы condition.type
// ---------------------------------------------------------------------------
// streakBest              — лучший стрик >= value
// lessonsAttended         — всего посещено пар >= value
// tasksCompleted          — всего выполнено заданий >= value
// subjectsAllHaveTaskDone — у каждого предмета есть хотя бы одно выполненное задание
// perfectDaysTotal        — всего идеальных дней (без пропусков) >= value
// perfectWeeksTotal       — всего идеальных недель (закончившихся) >= value
// consecutivePerfectWeeks — идеальных недель подряд (сейчас) >= value
// perfectMonthsTotal      — всего идеальных месяцев >= value
// monthsTrackedCount      — всего отслеженных (закончившихся) месяцев >= value
// yearEndTracked          — отслежен закончившийся декабрь
// comebackCount           — успешных дней сразу после больничного >= value
// subjectsCount           — всего предметов >= value
// subjectsFullyCompleted  — предметов с полностью выполненными заданиями >= value
// gachaRollsTotal         — всего круток гачи >= value
// gotRarity5              — получена хотя бы одна карточка 5★
// uniqueCardsCount        — разных полученных карточек >= value
// collectionHalf          — собрана половина всех карточек из cards.js
// collectionComplete      — собраны все карточки из cards.js
// anyDuplicate            — есть хотя бы один дубликат любой карточки
// duplicateOfSameCard     — есть карточка, скопированная >= value раз (включая оригинал)
// totalXPEarned           — заработано XP за всё время (не тратится) >= value
// currentXP               — текущий баланс XP (можно потратить) >= value
// ---------------------------------------------------------------------------
