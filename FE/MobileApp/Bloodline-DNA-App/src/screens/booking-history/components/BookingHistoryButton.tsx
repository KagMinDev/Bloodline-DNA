import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/root-stack/stack.types";

const BookingHistoryButton: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("BookingHistory");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Feather name="calendar" size={24} color="#2563eb" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Lịch sử đặt lịch</Text>
        <Text style={styles.subtitle}>Xem tất cả lịch hẹn của bạn</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
};

export default BookingHistoryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
});
