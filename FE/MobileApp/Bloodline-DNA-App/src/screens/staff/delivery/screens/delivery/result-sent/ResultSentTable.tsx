import { RootStackParamList } from "@/types/root-stack/stack.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
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

const ResultSent: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [data, setData] = useState<TestBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const selectedOrder = data.find((d) => d.id === selectedId);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = (await AsyncStorage.getItem("token")) || "";
      const result = await getTestBookingApi(token);
      const filtered = result.filter((item) => item.status === "Testing");
      setData(filtered);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickSendResult = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    try {
      const token = (await AsyncStorage.getItem("token")) || "";
      await updateTestBookingStatusStaff(
        { bookingId: selectedId, status: 8 },
        token
      );
      setModalVisible(false);
      setSelectedId(null);
      fetchData(); // refetch
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRowClick = (id: string) => {
    navigation.navigate("BlogDetail", { id }); // bạn có thể đổi route này theo yêu cầu
  };
  
  const renderItem = ({ item }: { item: TestBookingResponse }) => (
    <Pressable style={styles.row} onPress={() => handleRowClick(item.id)}>
      <View style={styles.rowInfo}>
        <Text style={styles.code}>Mã đơn: #{item.id}</Text>
        <Text style={styles.text}>Khách hàng: {item.clientName}</Text>
        <Text style={styles.text}>Số điện thoại: {item.phone}</Text>
        <Text style={styles.text}>
          Địa chỉ: {item.address || "Chưa cập nhật"}
        </Text>

        <View
          style={[
            styles.tag,
            {
              backgroundColor: statusColorMap[item.status] ?? "#6b7280",
              alignSelf: "flex-start",
              marginTop: 6,
            },
          ]}
        >
          <Text style={styles.tagText}>
            {statusTextMap[item.status] || item.status}
          </Text>
        </View>
      </View>

      <View style={styles.actionWrapper}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleClickSendResult(item.id)}
        >
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.btnText}>Gửi kết quả</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <HeaderStaff />

      {loading ? (
        <ActivityIndicator size="large" />
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

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận gửi kết quả</Text>
            {selectedOrder ? (
              <View>
                <Text style={styles.modalText}>
                  Gửi kết quả cho đơn{" "}
                  <Text style={{ fontWeight: "600" }}>#{selectedOrder.id}</Text>
                  ?
                </Text>
                <Text style={styles.modalText}>
                  Khách hàng: {selectedOrder.clientName}
                </Text>
                <Text style={styles.modalText}>SĐT: {selectedOrder.phone}</Text>
                <Text style={styles.modalText}>
                  Địa chỉ: {selectedOrder.address}
                </Text>
              </View>
            ) : (
              <Text style={styles.modalText}>Không tìm thấy đơn hàng.</Text>
            )}
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
                <Text style={styles.okText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ResultSent;
