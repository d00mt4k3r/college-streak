import { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/useTheme";
import { spacing, radius } from "../src/constants/theme";
import AppIcon from "../src/components/AppIcon";
import Section from "../src/components/Section";
import ProgressBar from "../src/components/ProgressBar";
import PrimaryButton from "../src/components/PrimaryButton";
import CardTile from "../src/components/CardTile";
import CardRarity from "../src/components/CardRarity";
import { useI18n } from "../src/i18n";
import { getCardContent } from "../src/i18n/content";
import { CARDS } from "../src/data/cards";
import { getCardFullImage } from "../src/logic/cardImages";

const RARITY_ORDER = [7, 5, 4, 3];
const RARITY_KEYS = { 7: "specialCards", 5: "rareCards", 4: "unusualCards", 3: "commonCards" };

export default function CollectionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, language } = useI18n();
  const { data, ready } = useApp();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const scrollRef = useRef(null);
  const detailRainbowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const selectedCard = CARDS.find((card) => card.id === selectedCardId);
    if (selectedCard?.rarity !== 7) return undefined;
    const animation = Animated.loop(
      Animated.timing(detailRainbowValue, { toValue: 7, duration: 2600, easing: Easing.linear, useNativeDriver: false })
    );
    animation.start();
    return () => animation.stop();
  }, [selectedCardId, detailRainbowValue]);

  if (!ready || !data) return null;

  const owned = data.cards.owned || {};
  const ownedCount = Object.keys(owned).filter((id) => owned[id] > 0).length;
  const selectedCard = CARDS.find((c) => c.id === selectedCardId);
  const selectedContent = selectedCard ? getCardContent(selectedCard, language) : null;
  const rarityColor = (r) => ({ 7: "#F500FF", 5: theme.warning, 4: theme.sick, 3: theme.info }[r] || theme.primary);
  const detailRainbowColor = detailRainbowValue.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7],
    outputRange: ["#FF1744", "#FF6D00", "#FFE600", "#00C853", "#00E5FF", "#2962FF", "#F500FF", "#FF1744"],
  });
  const detailFrameColor = selectedCard?.rarity === 7 ? detailRainbowColor : selectedCard ? rarityColor(selectedCard.rarity) : theme.border;

  // Карточка описания рисуется вверху экрана. Если пользователь нажал на карточку
  // ниже, где он уже проскроллил вниз — сами поднимаем экран к описанию, чтобы
  // не заставлять искать его руками.
  const handleSelectCard = (cardId) => {
    setSelectedCardId(cardId);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
      <ProgressBar value={ownedCount} total={CARDS.length} label={t("cardsReceived")} />

      {selectedCard && (
        <Animated.View style={[styles.detailBox, {
          borderColor: detailFrameColor,
          backgroundColor: theme.surface,
          shadowColor: detailFrameColor,
          shadowOpacity: selectedCard.rarity === 7 ? 1 : 0.45,
          shadowRadius: selectedCard.rarity === 7 ? 20 : 8,
          elevation: selectedCard.rarity === 7 ? 10 : 3,
        }]}>
          <View style={styles.detailRow}>
            {getCardFullImage(selectedCard) ? (
              <Image source={getCardFullImage(selectedCard)} style={styles.detailImage} resizeMode="cover" />
            ) : (
              <View style={[styles.detailImage, styles.detailImagePlaceholder, { backgroundColor: theme.surfaceSecondary }]}>
                <AppIcon name="card" size={30} color={theme.textSecondary} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailName, { color: theme.text }]}>{selectedContent.name}</Text>
              <Text style={[styles.detailQty, { color: theme.textSecondary }]}>{t("quantity")}: ×{owned[selectedCard.id] || 0}</Text>
            </View>
          </View>
          <CardRarity rarity={selectedCard.rarity} color={rarityColor(selectedCard.rarity)} />
          <Text style={[styles.detailDescription, { color: theme.textSecondary }]}>{selectedContent.description}</Text>
          <Pressable onPress={() => setSelectedCardId(null)}>
            <Text style={[styles.closeDetail, { color: theme.primary }]}>{t("close")}</Text>
          </Pressable>
        </Animated.View>
      )}

      {RARITY_ORDER.map((rarity) => {
        const cardsOfRarity = CARDS.filter((c) => c.rarity === rarity);
        if (rarity === 7 && !cardsOfRarity.some((c) => owned[c.id] > 0)) return null;
        if (cardsOfRarity.length === 0) return null;
        return (
          <Section key={rarity} title={t(RARITY_KEYS[rarity])}>
            <View style={styles.grid}>
              {cardsOfRarity.map((c) => (
                <CardTile key={c.id} card={c} quantity={owned[c.id] || 0} onPress={() => (owned[c.id] > 0) && handleSelectCard(c.id)} />
              ))}
            </View>
          </Section>
        );
      })}

      <PrimaryButton label={t("goGacha")} onPress={() => router.push("/gacha")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailBox: { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, marginVertical: spacing.md },
  detailRow: { flexDirection: "row", gap: spacing.md },
  detailImage: { width: 90, height: 126, borderRadius: radius.sm },
  detailImagePlaceholder: { alignItems: "center", justifyContent: "center" },
  detailName: { fontSize: 17, fontWeight: "800" },
  detailRarity: { fontSize: 13, fontWeight: "700", marginTop: 2 },
  detailQty: { fontSize: 13, marginTop: spacing.xs },
  detailDescription: { fontSize: 13, marginTop: spacing.sm, lineHeight: 18 },
  closeDetail: { fontWeight: "700", marginTop: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
