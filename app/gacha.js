import { useState, useRef } from "react";
import { View, Text, Pressable, Image, ScrollView, StyleSheet, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/useTheme";
import { spacing, radius } from "../src/constants/theme";
import AppIcon from "../src/components/AppIcon";
import PrimaryButton from "../src/components/PrimaryButton";
import Divider from "../src/components/Divider";
import { GACHA_CONFIG } from "../src/data/gachaConfig";
import { getCardFullImage, getCardBackground, getCardThumbnail } from "../src/logic/cardImages";
import { useI18n } from "../src/i18n";
import { getCardContent } from "../src/i18n/content";

const MULTI_COUNT = 10;

export default function GachaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, language } = useI18n();
  const { data, ready, rollGachaAction, rollGachaMultiAction } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null); // одиночный результат ×1
  const [multiResults, setMultiResults] = useState(null); // результаты ×10
  const [errorMessage, setErrorMessage] = useState(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.6)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const rainbowValue = useRef(new Animated.Value(0)).current;
  const rainbowAnimation = useRef(null);

  if (!ready || !data) return null;

  const currentXP = data.xp.current;
  const canAffordOne = currentXP >= GACHA_CONFIG.cost;
  const canAffordTen = currentXP >= GACHA_CONFIG.cost * MULTI_COUNT;
  const spinRotation = spinValue.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "1080deg"] });

  const rarityColor = (rarity) => ({ 7: "#F500FF", 5: theme.warning, 4: theme.sick, 3: theme.info }[rarity] || theme.primary);

  const startSpinAnimation = () => {
    rainbowAnimation.current?.stop();
    revealOpacity.setValue(0);
    revealScale.setValue(0.6);
    rainbowValue.setValue(0);
    spinValue.setValue(0);
    return new Promise((resolve) => {
      Animated.timing(spinValue, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(resolve);
    });
  };

  const playReveal = (rarity) => {
    if (rarity === 7) {
      rainbowAnimation.current = Animated.loop(
        Animated.timing(rainbowValue, { toValue: 7, duration: 2600, easing: Easing.linear, useNativeDriver: false })
      );
      rainbowAnimation.current.start();
    }
    Animated.parallel([
      Animated.timing(revealOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(revealScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const handleRollOne = async () => {
    setErrorMessage(null);
    if (!canAffordOne) { setErrorMessage("Недостаточно XP"); return; }

    setResult(null);
    setMultiResults(null);
    setSpinning(true);
    await startSpinAnimation();

    const rollResult = rollGachaAction();
    setSpinning(false);

    if (!rollResult.success) {
      setErrorMessage(rollResult.reason === "not_enough_xp" ? t("insufficientXp") : "Не удалось получить карточку");
      return;
    }

    setResult({ card: rollResult.card, isDuplicate: rollResult.isDuplicate, quantity: rollResult.quantity });
    playReveal(rollResult.card.rarity);
  };

  const handleRollTen = async () => {
    setErrorMessage(null);
    if (!canAffordTen) { setErrorMessage(t("insufficientXpTen")); return; }

    setResult(null);
    setMultiResults(null);
    setSpinning(true);
    await startSpinAnimation();

    const rollResult = rollGachaMultiAction(MULTI_COUNT);
    setSpinning(false);

    if (!rollResult.success) {
      setErrorMessage(rollResult.reason === "not_enough_xp" ? t("insufficientXp") : "Не удалось получить карточки");
      return;
    }

    setMultiResults(rollResult.results);
    playReveal();
  };

  const resultBg = result ? getCardBackground(result.card) : null;
  const resultImage = result ? getCardFullImage(result.card) : null;
  const resultContent = result ? getCardContent(result.card, language) : null;
  const resultRarityColor = result ? rarityColor(result.card.rarity) : theme.primary;
  const rainbowColor = rainbowValue.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7],
    outputRange: ["#FF1744", "#FF6D00", "#FFE600", "#00C853", "#00E5FF", "#2962FF", "#F500FF", "#FF1744"],
  });
  const resultFrameColor = result?.card.rarity === 7 ? rainbowColor : resultRarityColor;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.costRow}>
        <View>
          <Text style={[styles.xpLabel, { color: theme.text }]}>{currentXP} XP</Text>
          <Text style={[styles.costLabel, { color: theme.textSecondary }]}>{t("oneRollCost", { cost: GACHA_CONFIG.cost })}</Text>
        </View>
        <AppIcon name="gacha" size={26} color={theme.primary} />
      </View>
      <Divider style={{ marginBottom: spacing.lg }} />

      <ScrollView contentContainerStyle={styles.spinArea} style={{ flex: 1 }}>
        {spinning && (
          <Animated.View style={[styles.spinBox, { transform: [{ rotate: spinRotation }] }]}>
            <AppIcon name="card" size={70} color={theme.primary} />
          </Animated.View>
        )}

        {!spinning && result && (
          <Animated.View style={[styles.resultBox, { opacity: revealOpacity, transform: [{ scale: revealScale }] }]}>
            {result.isDuplicate && (
              <Text style={[styles.duplicateTag, { color: theme.warning }]}>{t("duplicate", { quantity: result.quantity })}</Text>
            )}
            <Animated.View style={[styles.resultFrame, {
                  borderColor: resultFrameColor,
                  shadowColor: resultFrameColor,
                  backgroundColor: theme.surfaceSecondary,
                  shadowOpacity: result.card.rarity === 7 ? 1 : 0.85,
                  shadowRadius: result.card.rarity === 7 ? 26 : 14,
                  elevation: result.card.rarity === 7 ? 12 : 6,
                }]}
              >
                <View style={styles.resultImageWrap}>
                  {resultBg && <Image source={resultBg} style={StyleSheet.absoluteFill} resizeMode="cover" />}
                  {resultImage ? (
                    <Image source={resultImage} style={styles.resultImage} resizeMode="cover" />
                  ) : (
                    <AppIcon name="card" size={60} color={theme.textSecondary} />
                  )}
                </View>
            </Animated.View>
            <Text style={[styles.resultName, { color: theme.text }]}>{resultContent.name}</Text>
          </Animated.View>
        )}

        {!spinning && multiResults && (
          <Animated.View style={{ opacity: revealOpacity, transform: [{ scale: revealScale }], width: "100%" }}>
            <Text style={[styles.multiTitle, { color: theme.text }]}>{t("receivedCards", { count: multiResults.length })}</Text>
            <View style={styles.multiGrid}>
              {multiResults.map((r, i) => {
                const thumb = getCardThumbnail(r.card);
                return (
                  <View key={i} style={[styles.multiTile, {
                    borderColor: rarityColor(r.card.rarity),
                    backgroundColor: theme.surfaceSecondary,
                    shadowColor: rarityColor(r.card.rarity),
                    shadowOpacity: 0.6,
                    shadowRadius: 7,
                    elevation: 5,
                  }]}>
                    {thumb ? (
                      <Image source={thumb} style={styles.multiTileImage} resizeMode="cover" />
                    ) : (
                      <AppIcon name="card" size={26} color={theme.textSecondary} />
                    )}
                    {r.isDuplicate && (
                      <View style={[styles.multiDupBadge, { backgroundColor: theme.warning }]}>
                        <Text style={styles.multiDupBadgeText}>×{r.quantity}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {!spinning && !result && !multiResults && (
          <View style={styles.placeholderBox}>
            <AppIcon name="card" size={56} color={theme.border} />
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>{t("rollHint")}</Text>
          </View>
        )}
      </ScrollView>

      {errorMessage && <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>}

      <View style={styles.rollButtonsRow}>
        <View style={{ flex: 1 }}>
          <PrimaryButton label={t("spinOne")} onPress={handleRollOne} disabled={spinning || !canAffordOne} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            label={t("spinTen")}
            onPress={handleRollTen}
            disabled={spinning || !canAffordTen}
            variant="outline"
          />
        </View>
      </View>

      <Pressable style={styles.collectionLink} onPress={() => router.push("/collection")}>
        <Text style={[styles.collectionLinkText, { color: theme.primary }]}>{t("openCollection")}</Text>
        <AppIcon name="chevronRight" size={14} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  costRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  xpLabel: { fontSize: 22, fontWeight: "800" },
  costLabel: { fontSize: 12, marginTop: 2 },
  spinArea: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingVertical: spacing.md },
  spinBox: { width: 140, height: 140, alignItems: "center", justifyContent: "center" },
  placeholderBox: { alignItems: "center", gap: spacing.sm },
  placeholderText: {},
  resultBox: { alignItems: "center" },
  duplicateTag: { fontWeight: "800", fontSize: 12, letterSpacing: 1, marginBottom: spacing.sm },
  resultImageWrap: {
    width: 170, height: 238, borderRadius: radius.lg,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  resultFrame: {
    width: 182, height: 250, borderRadius: radius.lg, borderWidth: 3, padding: 4,
    alignItems: "center", justifyContent: "center", marginBottom: spacing.sm,
    shadowOffset: { width: 0, height: 0 },
  },
  resultImage: { width: "100%", height: "100%" },
  resultName: { fontSize: 18, fontWeight: "800", marginTop: 2 },
  multiTitle: { fontSize: 15, fontWeight: "800", textAlign: "center", marginBottom: spacing.md },
  multiGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
  multiTile: { width: 66, height: 66, borderRadius: radius.md, borderWidth: 2, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  multiTileImage: { width: "100%", height: "100%" },
  multiDupBadge: { position: "absolute", bottom: 2, right: 2, borderRadius: radius.sm, paddingHorizontal: 4 },
  multiDupBadgeText: { fontSize: 9, fontWeight: "800", color: "#fff" },
  errorText: { textAlign: "center", marginBottom: spacing.sm, fontWeight: "600" },
  rollButtonsRow: { flexDirection: "row", gap: spacing.sm },
  collectionLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: spacing.md },
  collectionLinkText: { fontWeight: "700" },
});
