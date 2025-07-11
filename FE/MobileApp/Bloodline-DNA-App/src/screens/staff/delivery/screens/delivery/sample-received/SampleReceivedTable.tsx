import { RootStackParamList } from "@/types/root-stack/stack.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { updateTestBookingStatusStaff } from "../../../api/delivery";
import { getTestBookingApi } from "../../../api/testBookingApi";
import HeaderStaff from "../../../components/header";
import {
  statusColorMap,
  statusTextMap,
  TestBookingResponse,
} from "../../../types/delivery";
import { styles } from "./styles";

const SampleReceived: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [data, setData] = useState<TestBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: "",
    message: "",
  });

  const showInfoModal = (title: string, message: string) => {
    setInfoModalContent({ title, message });
    setInfoModalVisible(true);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = (await AsyncStorage.getItem("token")) ?? "";
      const result = await getTestBookingApi(token);
      const filtered = result.filter(
        (item) => item.status === "ReturningSample"
      );
      setData(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
      showInfoModal("Lỗi", "Không thể lấy danh sách đơn.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openConfirmModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    try {
      const token = (await AsyncStorage.getItem("token")) ?? "";
      await updateTestBookingStatusStaff(
        { bookingId: selectedId, status: 6 },
        token
      );
      showInfoModal("Thành công", "Đã xác nhận nhận mẫu Kit.");
      setModalVisible(false);
      setSelectedId(null);
      fetchData(); // refetch lại dữ liệu
    } catch (err) {
      console.error("Update error:", err);
      showInfoModal("Lỗi", "Không thể cập nhật trạng thái.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRowPress = (id: string) => {
    navigation.navigate("BlogDetail", { id }); // hoặc thay bằng screen phù hợp
  };

  const renderItem = ({ item }: { item: TestBookingResponse }) => (
    <Pressable style={styles.row} onPress={() => handleRowPress(item.id)}>
      <View style={styles.rowInfo}>
        <Text style={styles.code}>Mã đơn: #{item.id}</Text>
        <Text style={styles.client}>Khách hàng: {item.clientName}</Text>
        <Text style={styles.phone}>Số điện thoại: {item.phone}</Text>
        <Text style={styles.address}>
          Địa chỉ:{" "}
          {item.address || (
            <Text style={{ fontStyle: "italic" }}>Chưa cập nhật</Text>
          )}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <View
          style={[
            styles.tag,
            { backgroundColor: statusColorMap[item.status] ?? "#6b7280" },
          ]}
        >
          <Text style={styles.tagText}>
            {statusTextMap[item.status] || item.status}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            item.status !== "ReturningSample" && styles.btnDisabled,
          ]}
          disabled={item.status !== "ReturningSample"}
          onPress={() => openConfirmModal(item.id)}
        >
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.btnText}>Đã nhận mẫu</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <HeaderStaff />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : data.length === 0 ? (
        <Text style={styles.empty}>Không có đơn ReturningSample nào.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            marginTop: 10,
            paddingBottom: 16,
            paddingHorizontal: 10,
          }}
        />
      )}

      {/* Modal xác nhận */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận đã nhận mẫu Kit</Text>
            <Text style={styles.modalText}>
              Bạn có chắc muốn xác nhận đã nhận mẫu từ đơn #{selectedId}?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
                disabled={confirmLoading}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.okBtn]}
                onPress={handleConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.okText}>Xác nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal thông báo */}
      <Modal
        transparent
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{infoModalContent.title}</Text>
            <Text style={styles.modalText}>{infoModalContent.message}</Text>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                styles.okBtn,
                { alignSelf: "flex-end", marginTop: 20 },
              ]}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.okText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SampleReceived;
