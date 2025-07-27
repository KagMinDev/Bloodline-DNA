import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { TestBookingResponse } from "@/screens/appoiment/types/testBooking";

interface BookingHistoryCardProps {
  booking: TestBookingResponse;
  onPress: () => void;
  isLast?: boolean;
}

const BookingHistoryCard: React.FC<BookingHistoryCardProps> = ({
  booking,
  onPress,
  isLast = false,
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          label: "Chờ xử lý",
          color: "#f59e0b",
          bgColor: "#fef3c7",
          icon: "clock" as const,
        };
      case "Deposited":
        return {
          label: "Đã đặt cọc",
          color: "#2563eb",
          bgColor: "#dbeafe",
          icon: "credit-card" as const,
        };
      case "PreparingKit":
        return {
          label: "Chuẩn bị kit",
          color: "#7c3aed",
          bgColor: "#ede9fe",
          icon: "package" as const,
        };
      case "DeliveringKit":
        return {
          label: "Đang giao kit",
          color: "#0891b2",
          bgColor: "#cffafe",
          icon: "truck" as const,
        };
      case "KitDelivered":
        return {
          label: "Đã giao kit",
          color: "#059669",
          bgColor: "#d1fae5",
          icon: "check-circle" as const,
        };
      case "WaitingForSample":
        return {
          label: "Chờ lấy mẫu",
          color: "#dc2626",
          bgColor: "#fee2e2",
          icon: "droplet" as const,
        };
      case "ReturningSample":
        return {
          label: "Đang hoàn mẫu",
          color: "#ea580c",
          bgColor: "#fed7aa",
          icon: "rotate-ccw" as const,
        };
      case "SampleReceived":
        return {
          label: "Đã nhận mẫu",
          color: "#7c2d12",
          bgColor: "#fef3c7",
          icon: "inbox" as const,
        };
      case "Testing":
        return {
          label: "Đang xét nghiệm",
          color: "#1d4ed8",
          bgColor: "#dbeafe",
          icon: "activity" as const,
        };
      case "Completed":
        return {
          label: "Hoàn thành",
          color: "#16a34a",
          bgColor: "#dcfce7",
          icon: "check-circle-2" as const,
        };
      default:
        return {
          label: status,
          color: "#6b7280",
          bgColor: "#f3f4f6",
          icon: "help-circle" as const,
        };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  const statusInfo = getStatusInfo(booking.status);

  return (
    <TouchableOpacity
      style={[styles.card, isLast && styles.lastCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.bookingId}>#{booking.id.slice(-8)}</Text>
          <Text style={styles.clientName}>{booking.clientName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
          <Feather name={statusInfo.icon} size={12} color={statusInfo.color} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#64748b" />
          <Text style={styles.infoLabel}>Ngày hẹn:</Text>
          <Text style={styles.infoValue}>
            {formatDate(booking.appointmentDate)} - {formatTime(booking.appointmentDate)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color="#64748b" />
          <Text style={styles.infoLabel}>Địa chỉ:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {booking.address || "Không có"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="phone" size={16} color="#64748b" />
          <Text style={styles.infoLabel}>SĐT:</Text>
          <Text style={styles.infoValue}>{booking.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="dollar-sign" size={16} color="#64748b" />
          <Text style={styles.infoLabel}>Giá:</Text>
          <Text style={[styles.infoValue, styles.priceText]}>
            {formatPrice(booking.price)}
          </Text>
        </View>

        {booking.note && (
          <View style={styles.infoRow}>
            <Feather name="message-square" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Ghi chú:</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {booking.note}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.createdDate}>
          Tạo: {formatDate(booking.createdAt)} - {formatTime(booking.createdAt)}
        </Text>
        <View style={styles.actionContainer}>
          <Feather name="eye" size={16} color="#2563eb" />
          <Text style={styles.actionText}>Xem chi tiết</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingHistoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  lastCard: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  titleContainer: {
    flex: 1,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: "#64748b",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingTop: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
    minWidth: 60,
  },
  infoValue: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
  },
  priceText: {
    fontWeight: "600",
    color: "#dc2626",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  createdDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
});
