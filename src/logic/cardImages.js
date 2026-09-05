// Хелперы для работы с картинками карточки. Карточка может указать до трёх картинок:
//   image      — основная картинка (обязательна)
//   thumbnail  — маленькая версия для сетки в коллекции (необязательна)
//   background — фон для экрана получения карточки (необязателен)
// Если thumbnail/background не указаны — используется fallback (см. ниже), поэтому
// добавление новой карточки без этих полей ничего не сломает.

// Маленькая картинка для коллекции: если своего thumbnail нет — используем основную image
export function getCardThumbnail(card) {
  return card?.thumbnail || card?.image || null;
}

// Полноразмерная картинка для экрана открытия карточки в гаче
export function getCardFullImage(card) {
  return card?.image || card?.thumbnail || null;
}

// Фон карточки. Если своего фона нет — возвращаем null, и компонент сам
// рисует сплошную подложку в цвете редкости (см. RARITY_TINTS в CardTile/gacha.js)
export function getCardBackground(card) {
  return card?.background || null;
}
