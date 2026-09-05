import { Text, StyleSheet } from "react-native";

export default function CardRarity({ rarity, color, small = false }) {
  return (
    <Text style={[styles.stars, small && styles.small, { color }]} accessibilityLabel={`${rarity} звезд`}>
      {"⭐".repeat(rarity)}
    </Text>
  );
}

const styles = StyleSheet.create({
  stars: { fontSize: 16, lineHeight: 20, letterSpacing: 0 },
  small: { fontSize: 9, lineHeight: 11 },
});
