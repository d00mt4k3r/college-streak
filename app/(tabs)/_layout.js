import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "../../src/constants/theme";

function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Главная", tabBarIcon: () => <TabIcon emoji="🏠" /> }} />
      <Tabs.Screen name="tasks" options={{ title: "Задания", tabBarIcon: () => <TabIcon emoji="📚" /> }} />
      <Tabs.Screen name="calendar" options={{ title: "Календарь", tabBarIcon: () => <TabIcon emoji="📅" /> }} />
      <Tabs.Screen name="stats" options={{ title: "Статистика", tabBarIcon: () => <TabIcon emoji="📊" /> }} />
    </Tabs>
  );
}
