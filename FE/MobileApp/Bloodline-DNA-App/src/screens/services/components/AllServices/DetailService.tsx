import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { getCategoryLabel, getCollectionMethodLabel, TestResponse } from "@/screens/services/types/TestService";
import { getTestByIdApi } from "@/screens/services/api/TestServiceApi";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/root-stack/stack.types";

// Định nghĩa route params
type DetailServiceRouteProp = RouteProp<{ DetailsService: { id: string } }, "DetailsService">;

const DetailService: React.FC = () => {
  const route = useRoute<DetailServiceRouteProp>();
  const { id } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [service, setService] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const data = await getTestByIdApi(id, token || "");
        setService(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Không tìm thấy dịch vụ</Text>
      </View>
    );
  }

  const price = service.priceServices?.[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.category}>{getCategoryLabel(service.category)}</Text>
      <Text style={styles.description}>{service.description}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Giá:</Text>
          <Text style={styles.value}>
            {price ? `${price.price.toLocaleString()} ${price.currency}` : "Không rõ"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phương thức lấy mẫu:</Text>
          <Text style={styles.value}>
            {price ? getCollectionMethodLabel(price.collectionMethod) : "Không rõ"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Số lượng mẫu:</Text>
          <Text style={styles.value}>{service.sampleCount}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const priceServiceId = service.priceServices?.[0]?.id || "";
          navigation.navigate("AppointmentScreen", {
            testServiceId: service.id,
            priceServiceId,
          });
        }}
      >
        <Text style={styles.buttonText}>Đặt lịch ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailService;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 70,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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
