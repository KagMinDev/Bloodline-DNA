import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ProgressStep } from "@/screens/checkout/types/checkout";

interface Props {
  step: ProgressStep;
  index: number;
  isLast: boolean;
  paymentLoading: boolean;
  paymentError: string | null;
  handleStepAction: (payload: any) => void;
  bookingStatus: string;
  setIsSampleModalOpen: (open: boolean) => void;
  setPaymentLoading: (loading: boolean) => void;
  updateProgressAfterDelivery: () => void;
  shouldShowSampleButton: boolean;
  isDeliveryConfirmed: boolean;
  isCollectionConfirmed: boolean;
  bookingId: string;
  handleConfirmDelivery: (bookingId: string) => void;
  setDateTimePickerVisible: (visible: boolean) => void; // Thêm prop
  isConfirmingCollection: boolean; // Thêm prop
}

const StepItem: React.FC<Props> = ({
  step,
  isLast,
  paymentLoading,
  paymentError,
  handleStepAction,
  bookingStatus,
  setIsSampleModalOpen,
  setPaymentLoading,
  updateProgressAfterDelivery,
  shouldShowSampleButton,
  isDeliveryConfirmed,
  isCollectionConfirmed,
  bookingId,
  handleConfirmDelivery,
  setDateTimePickerVisible,
  isConfirmingCollection,
}) => {
  const getStatusColor = () => {
    switch (step.status) {
      case "completed":
        return "#22c55e";
      case "current":
        return "#2563eb";
      default:
        return "#d1d5db";
    }
  };

  const renderIcon = () => {
    const iconName =
      step.actionPayload?.type === "fill_sample_info"
        ? "edit-3"
        : "credit-card";
    return <Feather name={iconName as any} size={20} color="white" />;
  };

  const renderActionButton = () => {
    if (step.actionRequired && step.status === "current") {
      return (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => handleStepAction(step.actionPayload)}
            disabled={paymentLoading}
            style={styles.actionButton}
          >
            {paymentLoading &&
            (step.actionPayload?.type === "deposit" ||
              step.actionPayload?.type === "remaining") ? (
              <View style={styles.loading}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.actionText}>Đang xử lý...</Text>
              </View>
            ) : (
              <View style={styles.row}>
                {renderIcon()}
                <Text style={styles.actionText}>{step.actionText}</Text>
              </View>
            )}
          </TouchableOpacity>

          {step.actionPayload?.type !== "fill_sample_info" && (
            <Text style={styles.note}>
              ID: {step.actionPayload?.bookingId} | VNPay, MoMo, Banking
            </Text>
          )}
          {paymentError && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{paymentError}</Text>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  const renderConfirmDeliveryButton = () => {
    if (step.id === 3 && bookingStatus.toLowerCase() === "deliveringkit") {
      return isDeliveryConfirmed ? (
        <View style={{ marginTop: 12, backgroundColor: "#dcfce7", padding: 10, borderRadius: 8 }}>
          <View style={styles.row}>
            <Feather name="check-circle" size={18} color="#22c55e" />
            <Text style={{ color: "#22c55e", marginLeft: 6, fontWeight: "600" }}>
              Cảm ơn bạn đã xác nhận
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            onPress={() => handleConfirmDelivery(bookingId)}
            style={[styles.blueButton, { backgroundColor: "#16a34a" }]}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.row}>
                <Feather name="check" size={16} color="#fff" />
                <Text style={styles.blueButtonText}>Xác nhận Đã Nhận Kit</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.note}>
            Vui lòng xác nhận khi bạn đã nhận được Kit.
          </Text>
        </View>
      );
    }
    return null;
  };


  const renderCollectionButton = () => {
    if (step.id === 4 && bookingStatus.toLowerCase() === "waitingforsample") {
      return (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            style={[styles.blueButton, { backgroundColor: "#1d4ed8" }]}
            onPress={() => setDateTimePickerVisible(true)}
            disabled={isConfirmingCollection}
          >
            <Text style={styles.blueButtonText}>
              {isConfirmingCollection ? "Đang xác nhận..." : "📅 Chọn ngày giờ lấy mẫu"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.stepContainer}>
      {/* Left timeline */}
      <View style={styles.timeline}>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: getStatusColor(),
              borderWidth: step.status === "current" ? 3 : 0,
              borderColor: step.status === "current" ? "#bfdbfe" : "transparent",
            },
          ]}
        >
          {renderIcon()}
        </View>
        {!isLast && (
          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  step.status === "completed" ? "#22c55e" : "#d1d5db",
                height: step.actionRequired ? 112 : 80,
              },
            ]}
          />
        )}
      </View>

      {/* Right content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            step.status === "current" && { color: "#2563eb" },
          ]}
        >
          {step.title}
        </Text>
        <Text style={styles.description}>{step.description}</Text>

        {step.completedDate && (
          <Text style={styles.completed}>
            ✅ Hoàn thành:{" "}
            {new Date(step.completedDate).toLocaleString("vi-VN")}
          </Text>
        )}

        {step.estimatedDate && step.status === "pending" && (
          <Text style={styles.estimated}>
            🕒 Dự kiến:{" "}
            {new Date(step.estimatedDate).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        )}

        {step.details?.map((d, i) => (
          <Text key={i} style={styles.detail}>
            {d}
          </Text>
        ))}

        {renderActionButton()}
        {renderConfirmDeliveryButton()}
        {renderCollectionButton()}
      </View>
    </View>
  );
};

export default StepItem;

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timeline: {
    alignItems: "center",
    width: 50,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 2,
    marginTop: 4,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    paddingLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  description: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
  completed: {
    fontSize: 13,
    color: "#16a34a",
    marginTop: 8,
  },
  estimated: {
    fontSize: 13,
    color: "#2563eb",
    marginTop: 8,
  },
  detail: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  note: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 6,
  },
  errorBox: {
    marginTop: 10,
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fecaca",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    marginLeft: 6,
  },
  blueButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  blueButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});