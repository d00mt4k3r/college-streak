// РЕЕСТР ИКОНОК ПРИЛОЖЕНИЯ.
// Все экраны запрашивают иконки только по имени отсюда (<AppIcon name="home" />) —
// нигде в коде экранов иконки не импортируются напрямую. Благодаря этому иконку
// можно заменить в одном месте, и она поменяется сразу везде в приложении.
//
// КАК ЗАМЕНИТЬ ИКОНКУ НА СВОЮ КАРТИНКУ (PNG):
// 1. Положи PNG в assets/icons/, например my-streak.png.
// 2. Замени строку ниже, было:
//      streak: { component: Flame },
//    стало:
//      streak: { custom: require("../../assets/icons/my-streak.png") },
// 3. Сохрани файл — иконка сразу заменится везде, где используется "streak".
//
// КАК ЗАМЕНИТЬ ИКОНКУ НА СВОЮ КАРТИНКУ (SVG):
// 1. Положи .svg в assets/icons/, например my-streak.svg.
// 2. В САМОМ ВЕРХУ этого файла добавь импорт:
//      import MyStreakIcon from "../../assets/icons/my-streak.svg";
// 3. Замени запись в реестре:
//      streak: { customSvg: MyStreakIcon },
// 4. Сохрани файл.
// (Импорт .svg как компонента работает благодаря metro.config.js в корне проекта —
// его не нужно трогать.)
//
// Если что-то пошло не так (опечатка в имени, битый файл) — AppIcon.js просто
// ничего не покажет вместо иконки, а не уронит всё приложение.

import {
  Home, CalendarDays, ListChecks, BarChart3, Settings, Flame, Trophy, Sparkles, Dices, Layers,
  HeartPulse, PartyPopper, CheckCircle2, AlertTriangle, XCircle, Plus, Minus, Pencil, Trash2,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X, Check, Palette, Sun, Moon, Smartphone,
  Download, Upload, RotateCcw, GraduationCap, ClipboardList, Info, ArrowLeft, Star, Medal, Gem,
  RefreshCw, NotebookPen, Target, CalendarCheck2, BookOpen, Award, Gift,
} from "lucide-react-native";

export const ICONS = {
  // Нижняя навигация
  home: { component: Home },
  calendar: { component: CalendarDays },
  tasks: { component: ListChecks },
  statistics: { component: BarChart3 },
  settings: { component: Settings },

  // Главный экран / общие показатели
  streak: { component: Flame },
  achievement: { component: Trophy },
  xp: { component: Sparkles },
  gacha: { component: Dices },
  collection: { component: Layers },

  // Особые дни
  sick: { component: HeartPulse },
  holiday: { component: PartyPopper },

  // Статусы
  success: { component: CheckCircle2 },
  warning: { component: AlertTriangle },
  error: { component: XCircle },

  // Действия
  add: { component: Plus },
  remove: { component: Minus },
  edit: { component: Pencil },
  delete: { component: Trash2 },
  chevronLeft: { component: ChevronLeft },
  chevronRight: { component: ChevronRight },
  chevronUp: { component: ChevronUp },
  chevronDown: { component: ChevronDown },
  close: { component: X },
  check: { component: Check },
  back: { component: ArrowLeft },
  reopen: { component: RefreshCw },

  // Настройки / внешний вид
  appearance: { component: Palette },
  themeLight: { component: Sun },
  themeDark: { component: Moon },
  themeSystem: { component: Smartphone },
  exportData: { component: Download },
  importData: { component: Upload },
  resetData: { component: RotateCcw },
  info: { component: Info },

  // Предметы и расписание
  subject: { component: GraduationCap },
  schedule: { component: ClipboardList },
  notebook: { component: NotebookPen },

  // Достижения (используются как значения condition.icon в data/achievements.js)
  attendance: { component: GraduationCap },
  perfectDay: { component: Target },
  calendarCheck: { component: CalendarCheck2 },
  book: { component: BookOpen },
  award: { component: Award },
  gift: { component: Gift },

  // Прочее
  star: { component: Star },
  medal: { component: Medal },
  card: { component: Gem },
};

export default ICONS;
