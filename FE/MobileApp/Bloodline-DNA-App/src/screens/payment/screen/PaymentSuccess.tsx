import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated,} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { useAuth } from "@/context/auth/AuthContext";
import { CallbackApi, RemainingCallbackApi } from "@/screens/checkout/api/paymentApi";

type PaymentSuccessRouteProp = RouteProp<RootStackParamList, "PaymentSuccess">;
type PaymentSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList, "PaymentSuccess">;

const PaymentSuccess: React.FC = () => {
  const navigation = useNavigation<PaymentSuccessNavigationProp>();
  const route = useRoute<PaymentSuccessRouteProp>();
  const { token } = useAuth(); // Token lấy từ context hoặc hook

  const {
    bookingId,
    orderCode,
    amount,
    paymentType = "deposit",
  } = route.params || {};

  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  const [callbackSuccess, setCallbackSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Hiệu ứng animate
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Gọi callback API khi thành công
    if (bookingId && orderCode && token) {
      const payload = {
        bookingId,
        orderCode,
        status: "PAID", // có thể lấy từ route.params.status nếu cần chính xác
      };

      const callCallback = async () => {
        try {
          if (paymentType === "remaining") {
            await RemainingCallbackApi(payload, token);
            console.log("✅ RemainingCallbackApi success");
          } else {
            await CallbackApi(payload, token);
            console.log("✅ CallbackApi success");
          }
          setCallbackSuccess(true);
        } catch (err) {
          console.error("❌ Callback API error:", err);
        }
      };

      callCallback();
    }
  }, []);

  const handleBackToCheckout = () => {
    navigation.navigate("CheckoutScreen", { bookingId: bookingId || "" });
  };

  const handleBackToHome = () => {
    navigation.navigate("Main");
  };

  const getPaymentTypeText = () => {
    switch (paymentType) {
      case "deposit":
        return "Đặt cọc";
      case "remaining":
        return "Thanh toán còn lại";
      default:
        return "Thanh toán";
    }
  };

  const getSuccessMessage = () => {
    switch (paymentType) {
      case "deposit":
        return "Bạn đã đặt cọc thành công! Chúng tôi sẽ chuẩn bị kit và giao đến địa chỉ của bạn.";
      case "remaining":
        return "Thanh toán hoàn tất! Chúng tôi sẽ tiến hành xét nghiệm mẫu của bạn.";
      default:
        return "Thanh toán thành công!";
    }
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.successIcon}>
          <Feather name="check" size={60} color="#ffffff" />
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.subtitle}>{getSuccessMessage()}</Text>

        {/* Payment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Chi tiết thanh toán</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loại thanh toán:</Text>
            <Text style={styles.detailValue}>{getPaymentTypeText()}</Text>
          </View>

          {orderCode && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã giao dịch:</Text>
              <Text style={styles.detailValue}>{orderCode}</Text>
            </View>
          )}

          {bookingId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã đặt lịch:</Text>
              <Text style={styles.detailValue}>{bookingId}</Text>
            </View>
          )}

          {amount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số tiền:</Text>
              <Text style={styles.detailValueAmount}>
                {amount.toLocaleString()} VNĐ
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian:</Text>
            <Text style={styles.detailValue}>
              {new Date().toLocaleString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>🎯 Bước tiếp theo</Text>
          {paymentType === "deposit" ? (
            <Text style={styles.nextStepsText}>
              • Chúng tôi sẽ chuẩn bị kit xét nghiệm{"\n"}
              • Kit sẽ được giao đến địa chỉ của bạn trong 1-2 ngày{"\n"}
              • Bạn sẽ nhận được thông báo khi kit được giao
            </Text>
          ) : (
            <Text style={styles.nextStepsText}>
              • Mẫu của bạn sẽ được xét nghiệm{"\n"}
              • Kết quả sẽ có trong 7-14 ngày{"\n"}
              • Bạn sẽ nhận được thông báo khi có kết quả
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBackToCheckout}
        >
          <Feather name="eye" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Xem tiến độ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToHome}
        >
          <Feather name="home" size={20} color="#2563eb" />
          <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default PaymentSuccess;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    textAlign: "right",
  },
  detailValueAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22c55e",
    flex: 1,
    textAlign: "right",
  },
  nextStepsCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2563eb",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
});
