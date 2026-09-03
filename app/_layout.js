import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "../src/context/AppContext";
import { colors } from "../src/constants/theme";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="schedule/index" options={{ title: "Расписание" }} />
        <Stack.Screen name="schedule/templates" options={{ title: "Шаблоны недель" }} />
        <Stack.Screen name="schedule/template-detail" options={{ title: "Шаблон" }} />
        <Stack.Screen name="day/[date]" options={{ title: "День" }} />
      </Stack>
    </AppProvider>
  );
}
