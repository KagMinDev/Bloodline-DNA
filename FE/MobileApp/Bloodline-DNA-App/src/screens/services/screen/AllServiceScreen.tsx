// screens/AllServiceScreen.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TestResponse } from "../types/TestService";
import { getTestsApi } from "../api/TestServiceApi";
import CardService from "../components/AllServices/CardService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/root-stack/stack.types";

const AllServiceScreen: React.FC = () => {
  const [services, setServices] = useState<TestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Lấy token đúng cách
        const response = await getTestsApi(token || "");
        setServices(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, paddingTop: 70, }}>
      <Text style={styles.title}>Tất Cả Dịch Vụ</Text>
      {services.map((service) => (
        <CardService
          key={service.id}
          data={service}
          onPress={() => navigation.navigate("DetailsService", { id: service.id })}
        />
      ))}
    </ScrollView>
  );
};

export default AllServiceScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
    color: "#1e3a8a",
    textAlign: "center",
    paddingBottom: 25,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#6B7280",
  },
});
