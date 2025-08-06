import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
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

  // Modal control
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [completing, setCompleting] = useState(false);

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập camera để chụp ảnh.');
      }
    })();
  }, []);

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

  const openModal = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setPhoto(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setPhoto(null);
  };

  const showImagePickerOptions = async () => {
    const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();

    let needToAsk = false;

    if (cameraStatus !== "granted") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Lỗi", "Cần quyền truy cập camera.");
        return;
      }
      needToAsk = true;
    }

    if (libraryStatus !== "granted") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh.");
        return;
      }
      needToAsk = true;
    }

    // Nếu permissions đã ok rồi, thì show alert chọn
    Alert.alert(
      "Chụp ảnh",
      "Bạn muốn chọn ảnh từ đâu?",
      [
        {
          text: "Chụp ảnh mới",
          onPress: takePhoto,
        },
        {
          text: "Chọn từ thư viện",
          onPress: pickFromLibrary,
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.4,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    }
  };

  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Library picker error:', error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const handleConfirmComplete = async () => {
    if (!selectedOrder) return;

    if (!photo) {
      Alert.alert("Lỗi", "Bạn cần chọn ảnh xác nhận trước khi hoàn thành đơn này.");
      return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn hoàn thành đơn hàng này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            setCompleting(true);
            try {
              const formData = new FormData();

              // Create file object for Expo
              const fileExtension = photo.uri.split('.').pop() || 'jpg';
              const fileName = `delivery_${selectedOrder.id}_${Date.now()}.${fileExtension}`;

              formData.append("evidence", {
                uri: photo.uri,
                name: fileName,
                type: `image/${fileExtension}`,
              } as any);

              await completeDelivery(selectedOrder.id, formData);

              Alert.alert("Thành công", `Đã hoàn thành đơn hàng #${selectedOrder.id}`);
              closeModal();
              fetchDeliveries();
            } catch (err) {
              console.error("Complete delivery error:", err);
              Alert.alert("Lỗi", "Không thể hoàn thành đơn. Vui lòng thử lại.");
            } finally {
              setCompleting(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DeliveryOrder }) => {
    const isDisabled = item.status !== "DeliveringKit";

    return (
      <View style={styles.card}>
        <Text style={styles.code}>Mã đơn: #{item.id}</Text>
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
            onPress={() => openModal(item)}
          >
            <Text style={styles.buttonText}>Hoàn thành</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderStaff />
      <View style={styles.container}>
        <Text style={styles.title}>
          Danh sách đơn cần giao Kit: {deliveries.filter((d) => d.status === "DeliveringKit").length} đơn
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={deliveries.filter((d) => d.status === "DeliveringKit")}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {/* Modal chi tiết đơn + chụp ảnh + upload + hoàn thành */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>

                {selectedOrder && (
                  <>
                    <Text style={styles.modalText}>Mã đơn: <Text style={{ fontWeight: "bold" }}>#{selectedOrder.id}</Text></Text>
                    <Text style={styles.modalText}>Khách hàng: {selectedOrder.name || "N/A"}</Text>
                    <Text style={styles.modalText}>Số điện thoại: {selectedOrder.phone}</Text>
                    <Text style={styles.modalText}>Địa chỉ: {selectedOrder.address || "Chưa cập nhật"}</Text>
                    <Text style={styles.modalText}>Ghi chú: {selectedOrder.note || "Không có"}</Text>
                    <Text style={styles.modalText}>Trạng thái: {statusTextMap[selectedOrder.status]}</Text>

                    {/* Hiển thị ảnh đã chọn */}
                    {photo && (
                      <View style={{ alignItems: 'center', marginTop: 5 }}>
                        <Text style={styles.modalText}>Đã tải ảnh ✅</Text>
                        <Image
                          source={{ uri: photo.uri }}
                          style={{
                            width: 250,
                            height: 250,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: "#28a745"
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    )}

                    {/* Nút chọn ảnh */}
                    <TouchableOpacity
                      onPress={showImagePickerOptions}
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginVertical: 20,
                        padding: 30,
                        borderWidth: 1,
                        borderColor: "#007bff",
                        backgroundColor: "#fff",
                        borderRadius: 8,
                      }}
                      disabled={completing}
                    >
                      <MaterialIcons name="add-a-photo" size={24} color="#0a84ff" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#0a84ff' }}>
                        {photo ? "Chọn ảnh khác" : "Chụp ảnh xác nhận"}
                      </Text>
                    </TouchableOpacity>

                    {/* Nút xác nhận hoàn thành */}
                    <TouchableOpacity
                      onPress={handleConfirmComplete}
                      style={[
                        styles.button,
                        {
                          backgroundColor: photo ? "#28a745" : "#6c757d",
                          marginVertical: 10,
                          opacity: completing ? 0.7 : 1
                        },
                      ]}
                      disabled={!photo || completing}
                    >
                      {completing ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <ActivityIndicator color="#fff" size="small" />
                          <Text style={[styles.buttonText, { marginLeft: 10 }]}>Đang xử lý...</Text>
                        </View>
                      ) : (
                        <Text style={[styles.buttonText, { paddingVertical: 5 }]}>Xác nhận hoàn thành</Text>
                      )}
                    </TouchableOpacity>

                    {/* Nút hủy */}
                    <TouchableOpacity
                      onPress={closeModal}
                      style={[styles.button, { backgroundColor: "#dc3545", marginTop: 10 }]}
                      disabled={completing}
                    >
                      <Text style={styles.buttonText}>Hủy</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default DeliveriesStaffScreen;