import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import type { TestBookingResponse } from "@/screens/appoiment/types/testBooking";
import { getStatusColor, STATUS_MAPPING } from "@/screens/checkout/constants/status";
import { getUserInfoApi } from "@/screens/auth/apis/loginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BookingAppViewProps {
    booking: TestBookingResponse;
    onFillSampleInfo?: () => void;
}

const BookingStatus: React.FC<BookingAppViewProps> = ({ booking, onFillSampleInfo }) => {
    const [userInfo, setUserInfo] = useState<{
        fullName?: string;
        phone?: string;
        email?: string;
        address?: string;
    } | null>(null);

    const statusLabel =
        STATUS_MAPPING.find((s) => String(s.value) === String(booking.status))?.label || "Không rõ";

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                if (token) {
                    const user = await getUserInfoApi(token);
                    setUserInfo(user);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>📋 Thông tin đặt lịch</Text>
            <View style={styles.card}>
                <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Mã đặt lịch:</Text>
                    <Text style={styles.itemValue}>{booking.id || "Không rõ"}</Text>
                </View>
                <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Ngày hẹn:</Text>
                    <Text style={styles.itemValue}>{booking.appointmentDate
                        ? new Date(booking.appointmentDate).toLocaleString("vi-VN", {
                            weekday: "short",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "Không có"}</Text>
                </View>
                <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Trạng thái:</Text>
                    <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) },]}>
                        {statusLabel}</Text>
                </View>
                {booking.note && (
                    <View style={styles.itemRow}>
                        <Text style={styles.itemLabel}>Ghi chú:</Text>
                        <Text style={styles.itemValue}>{booking.note}</Text>
                    </View>
                )}
                <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Tổng tiền:</Text>
                    <Text style={styles.itemValue}>{typeof booking.price === "number"
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(booking.price)
                        : "0₫"}</Text>
                </View>

                {String(booking.status) === "3" && (
                    <TouchableOpacity style={styles.button} onPress={onFillSampleInfo}>
                        <Text style={styles.buttonText}>Điền thông tin mẫu</Text>
                    </TouchableOpacity>
                )}
            </View>

            {userInfo && (
                <>
                    <Text style={styles.sectionTitle}>👤 Thông tin người dùng</Text>
                    <View style={styles.card}>
                        <View style={styles.itemRow}>
                            <Text style={styles.itemLabel}>Họ tên:</Text>
                            <Text style={styles.itemValue}>{userInfo.fullName || "Không rõ"}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.itemLabel}>SĐT:</Text>
                            <Text style={styles.itemValue}>{userInfo.phone || "Không rõ"}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.itemLabel}>Email:</Text>
                            <Text style={styles.itemValue}>{userInfo.email || "Không rõ"}</Text>
                        </View>
                        <View style={styles.itemRow}>
                            <Text style={styles.itemLabel}>Địa chỉ:</Text>
                            <Text style={styles.itemValue}>{userInfo.address || "Không rõ"}</Text>
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default BookingStatus;


const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#f9fafb',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#02457A",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    itemLabel: {
        fontSize: 16,
        color: "#475569",
        fontWeight: "500",
    },
    itemValue: {
        fontSize: 17,
        color: "#0f172a",
        fontWeight: "600",
        flex: 1,
        textAlign: "right",
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 15,
        color: "white",
        backgroundColor: "#0284c7",
        overflow: "hidden",
        textAlign: "center",
        minWidth: 90,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 16,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
    },
});
