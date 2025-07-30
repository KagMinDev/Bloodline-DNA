import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { callbackApi, remainingCallbackApi } from "@/screens/checkout/api/paymentApi";
import { useAuth } from "@/context/auth/AuthContext";

type PaymentErrorRouteProp = RouteProp<RootStackParamList, "PaymentError">;
type PaymentErrorNavigationProp = NativeStackNavigationProp<RootStackParamList, "PaymentError">;

const PaymentError: React.FC = () => {
  const navigation = useNavigation<PaymentErrorNavigationProp>();
  const route = useRoute<PaymentErrorRouteProp>();
  const { token } =  useAuth();

  const {
    bookingId,
    orderCode,
    paymentType,
    message = "Thanh toán thất bại. Vui lòng thử lại sau.",
  } = route.params || {};

  console.log("PaymentError params received from WebViewScreen:", { bookingId, orderCode, paymentType, message });

  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
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

    if (bookingId && orderCode && token) {
      const callFailedCallback = async () => {
        try {
          const paymentTypeSafe: "deposit" | "remaining" = paymentType === "remaining" ? "remaining" : "deposit";
          console.log("Using paymentTypeSafe for callback:", paymentTypeSafe);
          const api = paymentTypeSafe === "remaining" ? remainingCallbackApi : callbackApi;
          const payload = {
            bookingId,
            orderCode,
            status: "CANCELLED",
          };
          console.log("Sending callback with payload:", payload);
          await api(payload, token);
          console.log(`✅ Successfully sent callback for ${paymentTypeSafe}`);
        } catch (error) {
          console.error(`❌ Failed to send callback for ${paymentType || "unknown"}:`, error);
        }
      };

      callFailedCallback();
    } else {
      console.warn("Missing required data for callback:", { bookingId, orderCode, token });
    }
  }, [bookingId, orderCode, token, paymentType]);

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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.errorIcon}>
          <Feather name="x" size={60} color="#ffffff" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Thanh toán thất bại</Text>
        <Text style={styles.subtitle}>{message}</Text>

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
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>📌 Gợi ý</Text>
          <Text style={styles.nextStepsText}>
            • Kiểm tra kết nối mạng hoặc thông tin thanh toán.{"\n"}
            • Vui lòng thử thanh toán lại hoặc liên hệ hỗ trợ nếu cần.
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBackToCheckout}>
          <Feather name="rotate-ccw" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Thử lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleBackToHome}>
          <Feather name="home" size={20} color="#ef4444" />
          <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default PaymentError;

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
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
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