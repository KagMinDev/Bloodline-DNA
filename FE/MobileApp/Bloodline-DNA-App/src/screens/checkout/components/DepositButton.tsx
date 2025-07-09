import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking,} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckoutApi } from "../api/paymentApi";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { deepLinkService, PaymentCallbackData } from "@/services/DeepLinkService";

interface DepositButtonProps {
  bookingId: string;
  amount: number;
  disabled?: boolean;
  onPaymentStart?: () => void;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const DepositButton: React.FC<DepositButtonProps> = ({
  bookingId,
  amount,
  disabled = false,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePaymentCallback = (data: PaymentCallbackData) => {
      setLoading(false);
      if (data.status === "PAID") {
        onPaymentSuccess?.();
        navigation.navigate("PaymentSuccess", {
          bookingId: data.bookingId,
          orderCode: data.orderCode,
          amount,
          paymentType: "deposit",
        });
      } else if (data.status === "ERROR") {
        onPaymentError?.("Có lỗi xảy ra khi xử lý thanh toán");
        Alert.alert("Lỗi", "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
      } else {
        onPaymentError?.("Thanh toán không thành công");
        Alert.alert("Thông báo", "Thanh toán đã bị hủy hoặc không thành công.");
      }
    };
    deepLinkService.registerPaymentListener(bookingId, handlePaymentCallback);
    return () => {
      deepLinkService.removePaymentListener(bookingId);
    };
  }, [bookingId, amount, navigation, onPaymentSuccess, onPaymentError]);

  const handleDepositPayment = async () => {

    if (!bookingId) {
      console.log("❌ BookingId is missing!");
      Alert.alert("Lỗi", "Không tìm thấy thông tin đặt lịch");
      return;
    }
    setLoading(true);
    onPaymentStart?.();

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");
      const result = await CheckoutApi(bookingId, token);
      
      if (result.checkoutUrl) {
        // Mở URL thanh toán trực tiếp
        const supported = await Linking.canOpenURL(result.checkoutUrl);
        if (supported) {
          await Linking.openURL(result.checkoutUrl);
        } else {
          throw new Error("Không thể mở liên kết thanh toán");
        }
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error: any) {
      console.error("Deposit payment error:", error);
      setLoading(false);
      onPaymentError?.(error.message);
      Alert.alert(
        "Lỗi thanh toán",
        error.message || "Không thể thực hiện thanh toán. Vui lòng thử lại."
      );
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Feather name="credit-card" size={20} color="#2563eb" />
          <Text style={styles.infoTitle}>Thanh toán đặt cọc</Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Số tiền cần thanh toán:</Text>
          <Text style={styles.amountValue}>{formatAmount(amount)}</Text>
        </View>
        
        <Text style={styles.infoDescription}>
          Đặt cọc 20% để xác nhận đặt lịch. Số tiền còn lại sẽ được thanh toán sau khi nhận mẫu.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.depositButton,
          (disabled || loading) && styles.depositButtonDisabled,
        ]}
        onPress={handleDepositPayment}
        disabled={disabled || loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.depositButtonText}>Đang xử lý...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Feather name="credit-card" size={20} color="#ffffff" />
            <Text style={styles.depositButtonText}>
              Đặt cọc {formatAmount(amount)} VNĐ
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.paymentMethods}>
        <Text style={styles.paymentMethodsTitle}>Phương thức thanh toán:</Text>
        <View style={styles.methodsRow}>
          <View style={styles.methodItem}>
            <Text style={styles.methodText}>VNPay</Text>
          </View>
          <View style={styles.methodItem}>
            <Text style={styles.methodText}>MoMo</Text>
          </View>
          <View style={styles.methodItem}>
            <Text style={styles.methodText}>Banking</Text>
          </View>
        </View>
      </View>

      <View style={styles.securityNote}>
        <Feather name="shield" size={16} color="#22c55e" />
        <Text style={styles.securityText}>
          Giao dịch được bảo mật và mã hóa an toàn
        </Text>
      </View>
    </View>
  );
};

export default DepositButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ea580c",
  },
  infoDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  depositButton: {
    backgroundColor: "#ea580c",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  depositButtonDisabled: {
    backgroundColor: "#94a3b8",
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  depositButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentMethodsTitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  methodsRow: {
    flexDirection: "row",
    gap: 8,
  },
  methodItem: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  methodText: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "500",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  securityText: {
    fontSize: 12,
    color: "#22c55e",
    marginLeft: 6,
  },
  debugCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    fontFamily: "monospace",
  },
});
