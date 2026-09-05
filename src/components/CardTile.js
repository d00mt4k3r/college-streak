import { useEffect, useRef } from "react";
import { Pressable, Image, View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "../theme/useTheme";
import AppIcon from "./AppIcon";
import CardRarity from "./CardRarity";
import { getCardThumbnail } from "../logic/cardImages";
import { radius } from "../constants/theme";

export default function CardTile({ card, quantity, onPress }) {
  const theme = useTheme();
  const owned = quantity > 0;
  const thumbnail = getCardThumbnail(card);
  const rarityColor = ({ 5: theme.warning, 4: theme.sick, 3: theme.info }[card.rarity] || theme.primary);
  const rainbowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (card.rarity !== 7) return undefined;
    const animation = Animated.loop(
      Animated.timing(rainbowValue, { toValue: 7, duration: 2600, easing: Easing.linear, useNativeDriver: false })
    );
    animation.start();
    return () => animation.stop();
  }, [card.rarity, rainbowValue]);

  const rainbowColor = rainbowValue.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7],
    outputRange: ["#FF1744", "#FF6D00", "#FFE600", "#00C853", "#00E5FF", "#2962FF", "#F500FF", "#FF1744"],
  });
  const frameColor = card.rarity === 7 ? rainbowColor : rarityColor;

  return (
    <View style={styles.cardWrap}>
      <Animated.View style={[styles.frame, {
        backgroundColor: theme.surfaceSecondary,
        borderColor: frameColor,
        shadowColor: frameColor,
        shadowOpacity: card.rarity === 7 ? 1 : 0.45,
        shadowRadius: card.rarity === 7 ? 14 : 7,
        elevation: card.rarity === 7 ? 10 : 4,
      }]}>
        <Pressable onPress={onPress} style={styles.tile}>
          <View style={styles.imageArea}>
            {owned ? (
              thumbnail ? (
                <Image source={thumbnail} style={styles.image} resizeMode="cover" />
              ) : (
                <AppIcon name="card" size={28} color={theme.textSecondary} />
              )
          ) : (
              <Text style={[styles.lockedText, { color: theme.textSecondary }]}>?</Text>
            )}
          </View>
          {owned && quantity > 1 && (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}> 
              <Text style={[styles.badgeText, { color: theme.onPrimary }]}>×{quantity}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
      <CardRarity rarity={card.rarity} color={card.rarity === 7 ? "#F500FF" : rarityColor} small />
    </View>
  );
}

const SIZE = 84;

const styles = StyleSheet.create({
  cardWrap: { width: SIZE + 4, alignItems: "center" },
  frame: {
    width: SIZE + 4, height: SIZE + 4, borderRadius: radius.md + 1, borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
  },
  tile: {
    width: SIZE, height: SIZE, borderRadius: radius.md, overflow: "hidden", backgroundColor: "transparent",
    alignItems: "center", justifyContent: "center",
  },
  imageArea: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  lockedText: { fontSize: 28, fontWeight: "800" },
  badge: { position: "absolute", bottom: 4, right: 4, borderRadius: radius.sm, paddingHorizontal: 5, paddingVertical: 1 },
  badgeText: { fontSize: 11, fontWeight: "800" },
});
