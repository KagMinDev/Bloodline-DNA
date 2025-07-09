import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { completeDelivery, getAssignedDeliveries } from "../../api/delivery";
import HeaderStaff from "../../components/header";
import {
    DeliveryOrder,
    statusColorMap,
    statusTextMap,
} from "../../types/delivery";
import styles from "./styles";

const DeliveriesStaffScreen = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAssignedDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn được phân công:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleComplete = (id: string) => {
    setConfirmingId(id);
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn hoàn thành đơn hàng #${id}?`,
      [
        { text: "Hủy", onPress: () => setConfirmingId(null), style: "cancel" },
        {
          text: "Hoàn thành",
          onPress: async () => {
            try {
              await completeDelivery(id);
              fetchDeliveries();
              Alert.alert("Thành công", `Đã hoàn thành đơn hàng #${id}`);
            } catch (err) {
              Alert.alert("Lỗi", "Không thể hoàn thành đơn.");
            } finally {
              setConfirmingId(null);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: DeliveryOrder }) => {
    const statusKey = item.status;
    const isDisabled = statusKey !== "DeliveringKit";

    return (
      <TouchableOpacity
        onPress={() => console.log("Clicked order:", item.id)}
        style={styles.card}
      >
        <Text style={styles.code}>#{item.id}</Text>
        <Text style={styles.text}>📍 {item.address}</Text>
        <Text style={styles.text}>📞 {item.phone}</Text>
        <Text style={styles.text}>
          🕒 {new Date(item.scheduledAt).toLocaleString("vi-VN")}
        </Text>
        <Text style={styles.note}>📝 {item.note || "Không có ghi chú"}</Text>
        <View style={styles.footer}>
          <Text style={[styles.status, { color: statusColorMap[item.status] }]}>
            {statusTextMap[item.status]}
          </Text>
          <TouchableOpacity
            disabled={isDisabled}
            style={[
              styles.button,
              isDisabled ? styles.disabledBtn : styles.activeBtn,
            ]}
            onPress={() => handleComplete(item.id)}
          >
            <Text style={styles.buttonText}>Hoàn thành</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderStaff />
      <View style={styles.container}>
        <Text style={styles.title}>Danh sách đơn được phân công: {deliveries.length} đơn</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={deliveries}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
};

export default DeliveriesStaffScreen;
