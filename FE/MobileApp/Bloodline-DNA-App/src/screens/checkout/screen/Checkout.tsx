import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Linking, Alert, TouchableOpacity, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTestBookingByIdApi } from "@/screens/appoiment/api/testbookingApi";
import type { TestBookingResponse } from "@/screens/appoiment/types/testBooking";
import { useRoute } from "@react-navigation/native";
import { getUserInfoApi } from "@/screens/auth/apis/loginApi";
import BookingStatus from "../components/BookingStatus";
import ProgressStepsContainer from "../components/ProgressStepsContainer";
import SampleInfoModal from "../components/SampleInfoModal";
import DepositButton from "../components/DepositButton";
import RemainingPaymentButton from "../components/RemainingPaymentButton";
import type { ProgressStep, TestProgressData } from "../types/checkout";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { checkoutApi, remainingPaymentApi } from "../api/paymentApi";


const CheckoutScreen: React.FC = () => {
  const route = useRoute<any>();
  const bookingId = route.params?.bookingId;
  const actualBookingId = bookingId;

  if (!actualBookingId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>❌ Không có booking ID</Text>
        <Text style={styles.errorSubtext}>Vui lòng quay lại và chọn booking</Text>
      </View>
    );
  }

  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<TestBookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<TestProgressData | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const generateProgressSteps = (booking: TestBookingResponse): ProgressStep[] => {
    const statusMap: Record<string, number> = {
      "Pending": 0,
      "Deposited": 1,
      "PreparingKit": 2,
      "DeliveringKit": 3,
      "KitDelivered": 4,
      "WaitingForSample": 5,
      "ReturningSample": 6,
      "SampleReceived": 7,
      "Testing": 8,
      "Completed": 9,
    };

    const currentStatus = statusMap[booking.status] ?? 0;
    const steps: ProgressStep[] = [
      {
        id: 1,
        title: "Đặt cọc",
        description: "Thanh toán 20% để xác nhận đặt lịch",
        status: currentStatus >= 1 ? "completed" : "current",
        actionRequired: currentStatus === 0,
        actionText: "Thanh toán đặt cọc",
        actionPayload: {
          type: "deposit",
          bookingId: booking.id,
          amount: booking.price ? booking.price * 0.2 : 0,
        },
      },
      {
        id: 2,
        title: "Chuẩn bị kit",
        description: "Chúng tôi đang chuẩn bị kit xét nghiệm",
        status: currentStatus >= 2 ? "completed" : currentStatus === 1 ? "current" : "pending",
      },
      {
        id: 3,
        title: "Giao kit",
        description: "Kit đang được giao đến địa chỉ của bạn",
        status: currentStatus >= 3 ? "completed" : currentStatus === 2 ? "current" : "pending",
      },
      {
        id: 4,
        title: "Lấy mẫu",
        description: "Thực hiện lấy mẫu theo hướng dẫn",
        status: currentStatus >= 6 ? "completed" : currentStatus >= 3 ? "current" : "pending",
        actionRequired: currentStatus === 3,
        actionText: "Điền thông tin mẫu",
        actionPayload: {
          type: "fill_sample_info",
          bookingId: booking.id,
        },
      },
      {
        id: 5,
        title: "Thanh toán còn lại",
        description: "Thanh toán 80% còn lại để tiến hành xét nghiệm",
        status: currentStatus >= 7 ? "completed" : currentStatus === 6 ? "current" : "pending",
        actionRequired: currentStatus === 6,
        actionText: "Thanh toán còn lại",
        actionPayload: {
          type: "remaining",
          bookingId: booking.id,
          amount: booking.price ? booking.price * 0.8 : 0,
        },
      },
      {
        id: 6,
        title: "Xét nghiệm",
        description: "Mẫu đang được xét nghiệm tại phòng lab",
        status: currentStatus >= 8 ? "completed" : currentStatus === 7 ? "current" : "pending",
      },
      {
        id: 7,
        title: "Hoàn tất",
        description: "Kết quả xét nghiệm đã sẵn sàng",
        status: currentStatus === 8 ? "completed" : "pending",
      },
    ];
    return steps;
  };

  const handleStepAction = async (payload: any) => {
  if (!payload || !booking) return;
  setPaymentLoading(true);
  setPaymentError(null);
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại");

    if (payload.type === "deposit") {
      const result = await checkoutApi(payload.bookingId, token);
      console.log("📦 Response from checkoutApi:", payload);

      if (result.checkoutUrl) {
        navigation.navigate("WebViewScreen", { url: result.checkoutUrl });
      }
    } else if (payload.type === "remaining") {
      const result = await remainingPaymentApi(payload.bookingId, token);
      if (result.checkoutUrl) {
        navigation.navigate("WebViewScreen", { url: result.checkoutUrl });
      }
    } else if (payload.type === "fill_sample_info") {
      setIsSampleModalOpen(true);
    }
  } catch (error) {
    console.error("Lỗi khi xử lý action:", error);
    setPaymentError("Có lỗi xảy ra. Vui lòng thử lại.");
  } finally {
    setPaymentLoading(false);
  }
};

  const onFillSampleInfo = () => {
    setIsSampleModalOpen(true);
  };

  const handleSampleInfoSubmit = (sampleInfo: any) => {
    console.log("Sample info submitted:", sampleInfo);
    Alert.alert(
      "Thành công",
      "Thông tin mẫu đã được ghi nhận. Vui lòng gửi mẫu theo hướng dẫn trong kit.",
      [{ text: "OK" }]
    );
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");
      const [userData, bookingData] = await Promise.all([
        getUserInfoApi(token),
        getTestBookingByIdApi(actualBookingId),
      ]);
      setUser(userData);
      setBooking(bookingData);
      if (bookingData) {
        const steps = generateProgressSteps(bookingData);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 14);

        const progressData: TestProgressData = {
          bookingId: bookingData.id,
          testType: "Xét nghiệm DNA",
          serviceType: "home",
          customerName: userData?.fullName || "Khách hàng",
          currentStep: Number(bookingData.status),
          steps,
          expectedResultDate: expectedDate.toISOString(),
        };
        setProgressData(progressData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [actualBookingId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#018ABE" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>🧬 Tiến độ xét nghiệm DNA</Text>
        <Text style={styles.headerSubtitle}>
          Theo dõi từng bước của quá trình xét nghiệm
        </Text>
      </View>

      {progressData && (
        <ProgressStepsContainer
          progressData={progressData}
          paymentLoading={paymentLoading}
          paymentError={paymentError}
          handleStepAction={handleStepAction}
          bookingStatus={booking?.status?.toString() || ""}
          setIsSampleModalOpen={setIsSampleModalOpen}
        />
      )}
      {booking && (booking.status === "Pending" || booking.status === "0") && (
        <DepositButton
          bookingId={booking.id}
          amount={booking.price ? booking.price * 0.2 : 0}
          onPaymentStart={() => setPaymentLoading(true)}
          onPaymentSuccess={() => {
            setPaymentLoading(false);
            fetchData();
          }}
          onPaymentError={(error) => {
            setPaymentLoading(false);
            setPaymentError(error);
          }}
        />
      )}
      {booking && booking.status === "SampleReceived" && (
        <RemainingPaymentButton
          bookingId={booking.id}
          amount={booking.price ? booking.price * 0.8 : 0}
          onPaymentStart={() => setPaymentLoading(true)}
          onPaymentSuccess={() => {
            setPaymentLoading(false);
            fetchData();
          }}
          onPaymentError={(error) => {
            setPaymentLoading(false);
            setPaymentError(error);
          }}
        />
      )}
      {booking && (
        <BookingStatus booking={booking} onFillSampleInfo={onFillSampleInfo} />
      )}
      <Text style={styles.sectionTitle}>� Thông tin khách hàng</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Họ tên:</Text>
          <Text style={styles.infoValue}>{user?.fullName || "Không rõ"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || "Không rõ"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>SĐT:</Text>
          <Text style={styles.infoValue}>{user?.phone || "Không rõ"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ:</Text>
          <Text style={styles.infoValue}>{user?.address || "Chưa cập nhật"}</Text>
        </View>
      </View>

      <SampleInfoModal
        visible={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        bookingId={booking?.id || ""}
        onSubmit={handleSampleInfoSubmit}
      />
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
  backgroundColor: "#ffffff",
  padding: 20,
  paddingTop: 80,
  marginBottom: 24,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 4,
  position: "relative",
},

backButton: {
  position: "absolute",
  top: 50,
  left: 16,
  padding: 8,
  zIndex: 10,
},

headerTitle: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#1e293b",
  marginBottom: 4,
  textAlign: "center",
  marginTop: 8,
},

headerSubtitle: {
  fontSize: 16,
  color: "#64748b",
  textAlign: "center",
  lineHeight: 22,
},
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
    color: "#374151",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
