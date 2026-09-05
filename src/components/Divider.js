import { View } from "react-native";
import { useTheme } from "../theme/useTheme";

export default function Divider({ style }) {
  const theme = useTheme();
  return <View style={[{ height: 1, backgroundColor: theme.border }, style]} />;
}
