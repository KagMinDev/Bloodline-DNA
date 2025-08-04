import { getTestBookingByIdApi } from "@/screens/appoiment/api/testbookingApi";
import type { TestBookingResponse } from "@/screens/appoiment/types/testBooking";
import { getUserInfoApi } from "@/screens/auth/apis/loginApi";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { confirmCollectionApi, confirmDeliveryApi, updateBookingStatusApi } from "../api/confirmDeliveryApi";
import { checkoutApi, remainingPaymentApi } from "../api/paymentApi";
import BookingStatus from "../components/BookingStatus";
import DepositButton from "../components/DepositButton";
import ProgressStepsContainer from "../components/ProgressStepsContainer";
import SampleInfoModalApp from "../components/SampleInfoModal";
import type { ProgressStep, TestProgressData } from "../types/checkout";

const CheckoutScreen: React.FC = () => {
  const route = useRoute<any>();
  const bookingId = route.params?.bookingId;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<TestBookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<TestProgressData | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [isConfirmingCollection, setIsConfirmingCollection] = useState(false);

  const canFillSample = booking?.status === "WaitingForSample";

  useEffect(() => {
    fetchData();
  }, [bookingId]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const [userData, bookingData] = await Promise.all([
        getUserInfoApi(token),
        getTestBookingByIdApi(bookingId),
      ]);

      setUser(userData);
      setBooking(bookingData);

      const steps = generateProgressSteps(bookingData);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 14);

      setProgressData({
        bookingId: bookingData.id,
        testType: "Xét nghiệm DNA",
        serviceType: "home",
        customerName: userData?.fullName || "Khách hàng",
        currentStep: 0,
        steps,
        expectedResultDate: expectedDate.toISOString(),
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateProgressSteps = (booking: TestBookingResponse): ProgressStep[] => {
    const statusMap: Record<string, number> = {
      Pending: 0,
      PreparingKit: 1,
      DeliveringKit: 2,
      KitDelivered: 3,
      WaitingForSample: 4,
      ReturningSample: 5,
      SampleReceived: 6,
      Testing: 7,
      Completed: 8,
      Cancelled: 9,
      StaffGettingSample: 10,
      CheckIn: 11,
    };

    const currentStatus = statusMap[booking.status] ?? 0;

    return [
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
          amount: booking.price * 0.2,
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
        description: "Kit đang được giao đến bạn",
        status: currentStatus >= 3 ? "completed" : currentStatus === 2 ? "current" : "pending",
        actionPayload: {
          type: "confirm_delivery",
          bookingId: booking.id,
        },
      },
      {
        id: 4,
        title: "Lấy mẫu",
        description: "Thực hiện lấy mẫu theo hướng dẫn",
        status: currentStatus >= 5 ? "completed" : currentStatus === 4 ? "current" : "pending",
        actionRequired: currentStatus === 4,
        actionText: "Điền thông tin mẫu",
        actionPayload: {
          type: "fill_sample_info",
          bookingId: booking.id,
        },
      },
      {
        id: 5,
        title: "Gửi mẫu",
        description: "Gửi mẫu về phòng xét nghiệm",
        status: currentStatus >= 6 ? "completed" : currentStatus === 5 ? "current" : "pending",
      },
      {
        id: 6,
        title: "Thanh toán còn lại",
        description: "Thanh toán 80% để tiến hành xét nghiệm",
        status: currentStatus >= 7 ? "completed" : currentStatus === 6 ? "current" : "pending",
        actionRequired: currentStatus === 6,
        actionText: "Thanh toán còn lại",
        actionPayload: {
          type: "remaining",
          bookingId: booking.id,
          amount: booking.price * 0.8,
        },
      },
      {
        id: 7,
        title: "Xét nghiệm",
        description: "Mẫu đang được xét nghiệm tại phòng lab",
        status: currentStatus >= 8 ? "completed" : currentStatus === 7 ? "current" : "pending",
      },
      {
        id: 8,
        title: "Hoàn tất",
        description: "Kết quả xét nghiệm đã sẵn sàng",
        status: currentStatus >= 8 ? "completed" : "pending",
      },
    ];
  };

  const appendPaymentType = (url: string, paymentType: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}paymentType=${paymentType}`;
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
        if (result.checkoutUrl) {
          const urlWithType = appendPaymentType(result.checkoutUrl, "deposit");
          navigation.navigate("WebViewScreen", { url: urlWithType });
        }
      } else if (payload.type === "remaining") {
        const result = await remainingPaymentApi(payload.bookingId, token);
        if (result.checkoutUrl) {
          const urlWithType = appendPaymentType(result.checkoutUrl, "remaining");
          navigation.navigate("WebViewScreen", { url: urlWithType });
        }
      } else if (payload.type === "fill_sample_info") {
        if (booking.status === "DeliveringKit") {
          await fetchData();
        } else if (booking.status === "WaitingForSample") {
          setIsSampleModalOpen(true);
        } else {
          Alert.alert("Không hợp lệ", "Trạng thái hiện tại không cho phép điền thông tin mẫu.");
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleConfirmCollection = async (date: Date) => {
    if (!bookingId) return;
    setIsConfirmingCollection(true);
    try {
      const isoDate = date.toISOString();
      await confirmCollectionApi(bookingId, isoDate);
      Alert.alert("Thành công", "Xác nhận nhân viên lấy mẫu thành công.");
      fetchData();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xác nhận thu mẫu. Vui lòng thử lại.");
    } finally {
      setIsConfirmingCollection(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#018ABE" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🧬 Tiến độ xét nghiệm DNA</Text>
        <Text style={styles.headerSubtitle}>Theo dõi từng bước của quá trình xét nghiệm</Text>
      </View>

      {progressData && (
        <ProgressStepsContainer
          progressData={progressData}
          paymentLoading={paymentLoading}
          paymentError={paymentError}
          handleStepAction={handleStepAction}
          bookingStatus={booking?.status || ""}
          setIsSampleModalOpen={setIsSampleModalOpen}
          setPaymentLoading={setPaymentLoading}
          updateProgressAfterDelivery={fetchData}
          shouldShowSampleButton={canFillSample}
          setDateTimePickerVisible={setDateTimePickerVisible}
          isConfirmingCollection={isConfirmingCollection}
          isDeliveryConfirmed={booking?.status === "KitDelivered" || booking?.status === "WaitingForSample"}
          isCollectionConfirmed={booking?.status === "SampleReceived"}
          bookingId={bookingId}
          handleConfirmDelivery={async (bookingId) => {
            try {
              const result = await confirmDeliveryApi(bookingId);
              if (result.success) {
                try {
                  await updateBookingStatusApi(bookingId, 4);
                } catch { }
              }
              fetchData();
            } catch {
              Alert.alert("Lỗi", "Không thể xác nhận đã nhận Kit.");
            }
          }}
        />
      )}

      {booking?.status === "Pending" && (
        <DepositButton bookingId={booking.id} amount={booking.price * 0.2} onPaymentStart={() => setPaymentLoading(true)} onPaymentSuccess={fetchData} onPaymentError={(err) => { setPaymentLoading(false); setPaymentError(err); }} />
      )}

      {booking && <BookingStatus booking={booking} onFillSampleInfo={() => setIsSampleModalOpen(true)} />}

      <Text style={styles.sectionTitle}>📋 Thông tin khách hàng</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Họ tên:</Text><Text style={styles.infoValue}>{user?.fullName || "Không rõ"}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Email:</Text><Text style={styles.infoValue}>{user?.email || "Không rõ"}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>SĐT:</Text><Text style={styles.infoValue}>{user?.phone || "Không rõ"}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Địa chỉ:</Text><Text style={styles.infoValue}>{user?.address || "Chưa cập nhật"}</Text></View>
      </View>

      <SampleInfoModalApp visible={isSampleModalOpen} onClose={() => setIsSampleModalOpen(false)} bookingId={bookingId} onSuccess={() => { setIsSampleModalOpen(false); fetchData(); }} />

      <DateTimePickerModal isVisible={isDateTimePickerVisible} mode="datetime" onConfirm={(date) => { setDateTimePickerVisible(false); handleConfirmCollection(date); }} onCancel={() => setDateTimePickerVisible(false)} minimumDate={new Date()} locale="vi-VN" />
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
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 16,
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
});