import { getStatusColor } from "@/screens/staff/constants/statusMapping";
import { getStatusLabel, renderCollectionMethod } from "@/screens/staff/utils/status";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import type { TestBookingResponse } from "../../../types/testBooking";
import { styles } from "./styles";

interface BookingListPanelProps {
  selectedDay: string;
  bookings: TestBookingResponse[];
  statusOptions: string[];
}

const BookingListPanel: React.FC<BookingListPanelProps> = ({
  selectedDay,
  bookings,
}) => {
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách đặt lịch ngày {selectedDay}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-remove"
              size={64}
              color="#E5E7EB"
            />
            <Text style={styles.emptyText}>Không có đặt lịch nào</Text>
          </View>
        ) : (
          sortedBookings.map((booking) => {
            const statusLabel = getStatusLabel(booking.status);
            const statusColor = getStatusColor(booking.status);

            return (
              <View key={booking.id} style={styles.card}>
                <Text style={styles.label}>
                  Tên khách hàng:{" "}
                  <Text style={styles.value}>
                    {booking.clientName || "Không có tên"}
                  </Text>
                </Text>
                <Text style={styles.subLabel}>
                  Đặt lúc: {new Date(booking.createdAt).toLocaleString("vi-VN")}
                </Text>
                <Text style={styles.info}>
                  Phương thức:{" "}
                  <Text style={styles.value}>
                    {renderCollectionMethod(booking.collectionMethod)}
                  </Text>
                </Text>
                <View style={styles.statusRow}>
                  <Text style={styles.info}>Trạng thái: </Text>
                  <View
                    style={[styles.statusTag, { backgroundColor: statusColor }]}
                  >
                    <Text style={styles.statusText}>{statusLabel}</Text>
                  </View>
                </View>
                <Text style={styles.info}>
                  Giá: {booking.price?.toLocaleString() || "0"} VNĐ
                </Text>
                <Text style={styles.info}>
                  Ghi chú: {booking.note || "Không có"}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default BookingListPanel;
