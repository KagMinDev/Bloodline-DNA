import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { completeDelivery, getAssignedDeliveries } from "../../../api/delivery";
import HeaderStaff from "../../../components/header";
import {
  DeliveryOrder,
  statusColorMap,
  statusTextMap,
} from "../../../types/delivery";
import styles from "./styles";

const SampleReceived = () => {
  const [data, setData] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssignedDeliveries();
      const filtered = result
        .filter((item) => item.status === "WaitingForPickup")
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      setData(filtered);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn:", error);
      Alert.alert("Lỗi", "Không thể lấy danh sách đơn.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const selectImage = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert("Lỗi", "Ứng dụng cần quyền truy cập camera và thư viện ảnh.");
      return;
    }

    Alert.alert(
      "Chọn ảnh",
      "Bạn muốn sử dụng ảnh từ đâu?",
      [
        {
          text: "Chụp ảnh mới",
          onPress: async () => {
            try {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.4,
              });
              if (!result.canceled && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
              }
            } catch (error) {
              console.error("Lỗi khi chụp ảnh:", error);
              Alert.alert("Lỗi", "Không thể chụp ảnh.");
            }
          },
        },
        {
          text: "Chọn từ thư viện",
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });
              if (!result.canceled && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
              }
            } catch (error) {
              console.error("Lỗi khi chọn ảnh:", error);
              Alert.alert("Lỗi", "Không thể chọn ảnh.");
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleConfirm = async () => {
    if (!selectedOrder || !imageUri) return;

    setConfirmLoading(true);
    try {
      const formData = new FormData();
      formData.append("evidence", {
        uri: imageUri,
        name: "evidence.jpg",
        type: "image/jpeg",
      } as any);

      await completeDelivery(selectedOrder.id, formData);
      Alert.alert("Thành công", "Đã xác nhận nhận mẫu Kit.");
      setModalVisible(false);
      setSelectedOrder(null);
      setImageUri(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xác nhận:", error);
      Alert.alert("Lỗi", "Không thể xác nhận đơn hàng.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderItem = ({ item }: { item: DeliveryOrder }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Text style={styles.code}>Mã đơn: #{item.id}</Text>
      <Text style={styles.text}>📍 {item.address || "Chưa cập nhật"}</Text>
      <Text style={styles.text}>📞 {item.phone}</Text>
      <Text style={styles.text}>
        🕒 {new Date(item.scheduledAt).toLocaleString("vi-VN")}
      </Text>
      <Text style={styles.note}>📝 {item.note || "Không có ghi chú"}</Text>
      <View style={styles.footer}>
        <Text style={[styles.status, { color: statusColorMap[item.status] }]}>
          {statusTextMap[item.status] || item.status}
        </Text>
        <View style={styles.right}>
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.confirmText}>Đã nhận mẫu</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderStaff />
      <View style={styles.container}>
        <Text style={styles.title}>
          Danh sách yêu cầu nhận lại mẫu Kit: {data.length} đơn
        </Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : data.length === 0 ? (
          <Text style={styles.empty}>Không có đơn WaitingForPickup nào.</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>

      {/* Modal xác nhận */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận đã nhận mẫu Kit</Text>
            <Text style={styles.modalText}>
              Bạn có chắc muốn xác nhận đã nhận mẫu từ đơn <Text style={{ fontWeight: "bold" }}>#{selectedOrder?.id}</Text>?
            </Text>
            <View style={styles.modalDetail}>
              <Text>Mã đơn: #{selectedOrder?.id}</Text>
              <Text>Khách hàng: {selectedOrder?.name}</Text>
              <Text>Điện thoại: {selectedOrder?.phone}</Text>
              <Text>Địa chỉ: {selectedOrder?.address}</Text>
              <Text>Ghi chú: {selectedOrder?.note || "Không có"}</Text>
            </View>

            <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
              <MaterialIcons name="add-a-photo" size={24} color="#007bff" />
              <Text style={{ color: "#007bff" }}>
                {imageUri ? "Đã tải ảnh ✅" : "Chụp ảnh xác nhận"}
              </Text>
            </TouchableOpacity>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setModalVisible(false);
                  setImageUri(null);
                }}
                disabled={confirmLoading}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: imageUri ? "#28a745" : "#6c757d",
                    opacity: confirmLoading ? 0.6 : 1,
                  },
                ]}
                onPress={handleConfirm}
                disabled={confirmLoading || !imageUri}
              >
                {confirmLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.okText}>Xác nhận đã nhận lại Mẫu Kit</Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SampleReceived;
