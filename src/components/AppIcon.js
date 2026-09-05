// Единая точка отрисовки любой иконки приложения. Смотрит в реестр src/config/icons.js.
// Если иконки с таким именем нет или она сломана — просто ничего не рисует,
// вместо того чтобы уронить экран (пункт 14 задания: конфиг не должен ломать приложение).
//
// Поддерживает три варианта записи в реестре:
//   { component: Flame }                                  — стандартная иконка (lucide)
//   { custom: require("../../assets/icons/x.png") }        — своя PNG-картинка
//   { customSvg: MyIconComponent }                          — свой SVG (см. README про импорт .svg)

import { Image } from "react-native";
import { ICONS } from "../config/icons";

export default function AppIcon({ name, size = 22, color = "#000", strokeWidth = 2, style }) {
  const entry = ICONS[name];
  if (!entry) return null;

  if (entry.customSvg) {
    const SvgComponent = entry.customSvg;
    try {
      return <SvgComponent width={size} height={size} color={color} style={style} />;
    } catch (e) {
      return null;
    }
  }

  if (entry.custom) {
    return <Image source={entry.custom} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
  }

  const Component = entry.component;
  if (!Component) return null;

  try {
    return <Component size={size} color={color} strokeWidth={strokeWidth} style={style} />;
  } catch (e) {
    return null;
  }
}
