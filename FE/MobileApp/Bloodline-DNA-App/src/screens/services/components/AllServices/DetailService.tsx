import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import { getCategoryLabel, getCollectionMethodLabel, TestResponse,} from "@/screens/services/types/TestService";
import { getTestByIdApi } from "@/screens/services/api/TestServiceApi";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

// Route params
type DetailServiceRouteProp = RouteProp<{ DetailsService: { id: string } }, "DetailsService">;

const DetailService: React.FC = () => {
  const route = useRoute<DetailServiceRouteProp>();
  const { id } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
  const formattedFrom = price?.effectiveFrom
    ? moment(price.effectiveFrom).format("DD/MM/YYYY")
    : "";
  const formattedTo = price?.effectiveTo
    ? moment(price.effectiveTo).format("DD/MM/YYYY")
    : "";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="#2563EB" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
      {/* Tiêu đề dịch vụ */}
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.category}>{getCategoryLabel(service.category)}</Text>
      <Text style={styles.description}>{service.description}</Text>

      {/* Chi tiết */}
      <View style={styles.card}>
        <InfoRow label="Giá" value={price ? `${price.price.toLocaleString()} ` : "Không rõ"} />
        <InfoRow label="Phương thức lấy mẫu" value={price ? getCollectionMethodLabel(price.collectionMethod) : "Không rõ"} />
        <InfoRow label="Số lượng mẫu" value={service.sampleCount.toString()} />
        {formattedFrom && formattedTo && (
          <InfoRow label="Hiệu lực" value={`${formattedFrom} - ${formattedTo}`} />
        )}
      </View>

      {/* Nút đặt lịch */}
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
        <Text style={styles.buttonText}> Đặt lịch ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Thành phần con để hiển thị từng dòng thông tin
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default DetailService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 70,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 28,
  },
  row: {
    marginBottom: 14,
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
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "500",
  },
});
