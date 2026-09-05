// Логика выпадения карточек. Специально не знает НИЧЕГО о конкретных карточках,
// кроме того, что взято из data/cards.js — так конфиг можно редактировать свободно.

import { CARDS } from "../data/cards";
import { GACHA_CONFIG } from "../data/gachaConfig";

// Сначала выбираем редкость по вероятностям из GACHA_CONFIG.rarityRates,
// потом случайную карточку именно этой редкости из CARDS.
function pickRarity() {
  const roll = Math.random();
  // Сортируем от редкой к частой, чтобы порядок сравнения был предсказуемым
  const rarities = Object.keys(GACHA_CONFIG.rarityRates).map(Number).sort((a, b) => b - a);

  let cumulative = 0;
  for (const rarity of rarities) {
    cumulative += GACHA_CONFIG.rarityRates[rarity];
    if (roll < cumulative) return rarity;
  }
  // На случай погрешности округления (0.999999 вместо 1.0) — берём последнюю редкость
  return rarities[rarities.length - 1];
}

// Пытается сделать одну крутку. Ничего не мутирует — возвращает новые данные.
export function rollGacha(data) {
  if (data.xp.current < GACHA_CONFIG.cost) {
    return { data, success: false, reason: "not_enough_xp" };
  }

  const rarity = pickRarity();
  const pool = CARDS.filter((c) => c.rarity === rarity);

  if (pool.length === 0) {
    // Например, если для какой-то редкости временно нет ни одной карточки в конфиге
    return { data, success: false, reason: "empty_pool" };
  }

  const card = pool[Math.floor(Math.random() * pool.length)];

  const owned = { ...(data.cards.owned || {}) };
  const wasOwnedBefore = (owned[card.id] || 0) > 0;
  owned[card.id] = (owned[card.id] || 0) + 1;

  const nextData = {
    ...data,
    xp: { ...data.xp, current: data.xp.current - GACHA_CONFIG.cost },
    cards: { owned, totalRolls: (data.cards.totalRolls || 0) + 1 },
  };

  return { data: nextData, success: true, card, isDuplicate: wasOwnedBefore, quantity: owned[card.id] };
}
