const TITLES_UK = {
  streak_1: "Перший крок", streak_3: "Головне — почати", streak_5: "Це схвалено", streak_7: "Пережив будні", streak_10: "Стабільний перформанс", streak_14: "Два тижні без фокусів", streak_21: "Одного разу", streak_30: "Режим термінатора", streak_50: "Підозріло стабільно", streak_75: "Автопілот активовано", streak_100: "Жодного розриву", streak_150: "Титановий стрижень", streak_200: "Переможець життя",
  lessons_10: "Випадковий свідок", lessons_25: "План-пастка працює", lessons_50: "Аватар аудиторії", lessons_100: "Меблі першої парти", lessons_250: "Постійний мешканець", lessons_500: "Коректний орендар", lessons_1000: "Частина корабля, частина команди",
  tasks_1: "Початок покладено", tasks_5: "Прогрес очевидний", tasks_10: "Анжумання 10 разів", tasks_25: "Не багато, не мало", tasks_50: "Роботи непочатий край", tasks_100: "Машина без гальм", tasks_250: "Power and motivation", tasks_subject_all: "Надзусилля у всіх сферах",
  perfect_day_1: "Сьогодні без пригод", perfect_day_3: "Хет-трик", perfect_day_7: "Тиждень вдався", perfect_day_10: "Естетика бездоганності", perfect_day_30: "Без сучка і задирки",
  calendar_week: "Подолання і крапка", calendar_weeks_row: "Чиназес", calendar_month_perfect: "Плани Наполеона", calendar_month_done: "Дорогі друзі, сисимасиси",
  recovery_back: "І повстали машини з попелу", recovery_veteran: "Стійкий боєць",
  subject_first: "Початок розслідування", subject_five: "Скритопул", subject_close_one: "Поки ти без справ", subject_close_three: "Із князів у грязюку",
  gacha_first_roll: "Закинув вудку", gacha_first_5star: "Пощастило-пощастило", gacha_5_unique: "Лудоманія", gacha_10_unique: "Безпочечний", gacha_half_collection: "Різнобарвна колекція", gacha_full_collection: "Absolute Cinema", gacha_duplicate: "Double life", gacha_triple_duplicate: "Три в ряд",
  xp_first_100: "Гроші люблять рахунок", xp_accumulate_500: "Фінансова подушка безпеки", xp_accumulate_1000: "Тисяча вiд Зеленського", xp_total_5000: "Пасивний дохід",
};

export function getAchievementContent(achievement, language) {
  if (language !== "uk") return achievement;
  const value = achievement.condition.value;
  const type = achievement.condition.type;
  const descriptions = {
    streakBest: `Протриматися ${value} навчальних днів поспіль`,
    lessonsAttended: `Відвідати ${value} пар`,
    tasksCompleted: `Виконати ${value} завдань`,
    perfectDaysTotal: `${value} ідеальних навчальних днів`,
    perfectWeeksTotal: `Пройти ${value} навчальний тиждень без пропусків`,
    consecutivePerfectWeeks: `${value} ідеальні тижні поспіль`,
    perfectMonthsTotal: `${value} ідеальний календарний місяць`,
    monthsTrackedCount: `Завершити відстеження ${value} календарного місяця`,
    yearEndTracked: "Довести відстеження до кінця року",
    comebackCount: `Успішно повернутися до навчання після лікарняного ${value} рази`,
    subjectsCount: `Створити ${value} предметів`,
    subjectsFullyCompleted: `Повністю закрити ${value} предметів`,
    gachaRollsTotal: `Зробити ${value} круток у гачі`,
    uniqueCardsCount: `Отримати ${value} різних карток`,
    collectionHalf: "Зібрати половину колекції карток",
    collectionComplete: "Зібрати всі картки",
    anyDuplicate: "Отримати повторну картку",
    duplicateOfSameCard: `Отримати ${value} копії однієї картки`,
    totalXPEarned: `Заробити ${value} XP за весь час`,
    currentXP: `Накопичити ${value} XP на балансі`,
    gotRarity5: "Отримати першу картку 5★",
    subjectsAllHaveTaskDone: "Виконати хоча б одне завдання з кожного предмета",
  };
  return { title: TITLES_UK[achievement.id] || achievement.title, description: descriptions[type] || achievement.description };
}
