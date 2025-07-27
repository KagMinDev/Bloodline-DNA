import { getBookingsByUserIdApi } from "@/screens/appoiment/api/testbookingApi";
import type { TestBookingResponse } from "@/screens/appoiment/types/testBooking";
import { getUserInfoApi } from "@/screens/auth/apis/loginApi";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import BookingHistoryCard from "../components/BookingHistoryCard";

const BookingHistory: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [bookings, setBookings] = useState<TestBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      const userData = await getUserInfoApi(token);
      setUser(userData);

      if (!userData?.id) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }
      const bookingsData = await getBookingsByUserIdApi(userData.id);

      const sortedBookings = bookingsData.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setBookings(sortedBookings);

    } catch (error: any) {
      setError(error.message);

      if (error.message.includes("Authentication")) {
        Alert.alert(
          "Phiên đăng nhập hết hạn",
          "Vui lòng đăng nhập lại",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchBookings(true);
  };

  const handleBookingPress = (booking: TestBookingResponse) => {
    navigation.navigate("CheckoutScreen", { bookingId: booking.id });
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      total: bookings.length,
    };

    bookings.forEach(booking => {
      switch (booking.status) {
        case "Pending":
          counts.pending++;
          break;
        case "Completed":
          counts.completed++;
          break;
        default:
          counts.inProgress++;
          break;
      }
    });

    return counts;
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [])
  );

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải lịch sử đặt lịch...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Feather name="alert-circle" size={48} color="#dc2626" />
        <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchBookings()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Lịch sử đặt lịch</Text>
          <Text style={styles.headerSubtitle}>Xem tất cả các lịch hẹn của bạn</Text>
        </View>
      </View>



      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{statusCounts.total}</Text>
          <Text style={styles.statLabel}>Tổng số</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#f59e0b" }]}>
            {statusCounts.pending}
          </Text>
          <Text style={styles.statLabel}>Chờ xử lý</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#2563eb" }]}>
            {statusCounts.inProgress}
          </Text>
          <Text style={styles.statLabel}>Đang thực hiện</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#22c55e" }]}>
            {statusCounts.completed}
          </Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
      </View>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="calendar" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Chưa có lịch hẹn nào</Text>
          <Text style={styles.emptyText}>
            Bạn chưa đặt lịch xét nghiệm nào. Hãy đặt lịch đầu tiên của bạn!
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("Services")}
          >
            <Feather name="plus" size={20} color="#ffffff" />
            <Text style={styles.createButtonText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bookingsList}>
          <Text style={styles.sectionTitle}>
            Danh sách lịch hẹn ({bookings.length})
          </Text>
          {bookings.map((booking, index) => (
            <BookingHistoryCard
              key={booking.id}
              booking={booking}
              onPress={() => handleBookingPress(booking)}
              isLast={index === bookings.length - 1}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default BookingHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 21,
  },

  headerTextContainer: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  userCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 28,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bookingsList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dc2626",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
