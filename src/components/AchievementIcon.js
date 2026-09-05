// Иконка достижения: если в конфиге достижения указана кастомная картинка (поле image,
// require(...)) — показываем её. Если нет — берём обычную иконку по имени (поле icon,
// ключ из src/config/icons.js). Если и это не найдено — используем иконку "achievement"
// по умолчанию, чтобы битый конфиг не ронял экран (пункт 14 задания).

import { Image } from "react-native";
import AppIcon from "./AppIcon";
import { ICONS } from "../config/icons";

export default function AchievementIcon({ achievement, size = 26, color, style }) {
  if (achievement?.image) {
    return (
      <Image
        source={achievement.image}
        style={[{ width: size, height: size, borderRadius: size / 6 }, style]}
        resizeMode="cover"
      />
    );
  }

  const iconName = achievement?.icon && ICONS[achievement.icon] ? achievement.icon : "achievement";
  return <AppIcon name={iconName} size={size} color={color} style={style} />;
}
