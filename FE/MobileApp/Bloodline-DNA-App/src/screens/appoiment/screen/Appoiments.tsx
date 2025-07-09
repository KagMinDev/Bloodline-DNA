import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity, } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TestBookingRequest } from "../types/testBooking";
import { createTestBookingApi } from "../api/testbookingApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AppointmentScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "AppointmentScreen">>();
  const { testServiceId, priceServiceId } = route.params || {};
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  console.log("Route params:", route.params);
  console.log("testServiceId:", testServiceId);
  console.log("priceServiceId:", priceServiceId);
  const [form, setForm] = useState<Omit<TestBookingRequest, "appointmentDate"> & { appointmentDate: Date }>({
    clientName: "",
    address: "",
    phone: "",
    note: "",
    testServiceId: testServiceId || "",
    clientId: "",
    priceServiceId: priceServiceId || "",
    appointmentDate: new Date(),
  });

  useEffect(() => {
    const loadClientId = async () => {
      try {
        const clientId = await AsyncStorage.getItem("clientId");
        if (clientId) {
          setForm(prev => ({ ...prev, clientId }));
        }
      } catch (error) {
        console.error("Error loading clientId:", error);
      }
    };
    loadClientId();
  }, []);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | Date) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!testServiceId || !priceServiceId) {
      Alert.alert("Lỗi", "Thiếu thông tin dịch vụ. Vui lòng quay lại và chọn lại dịch vụ.");
      return;
    }
    if (!form.clientName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!form.address.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ.");
      return;
    }
    if (!form.phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại.");
      return;
    }
    setLoading(true);
    try {
      const payload: TestBookingRequest = {
        ...form,
        testServiceId: testServiceId!,
        priceServiceId: priceServiceId!,
        appointmentDate: form.appointmentDate.toISOString(),
      };
      const result = await createTestBookingApi(payload);
      let bookingId = "";
      if (typeof result === 'string') {
        bookingId = result;
      } else if (result && typeof result === 'object' && result.id) {
        bookingId = result.id;
      } else {
        throw new Error("Invalid response format from create booking API");
      }
      if (!bookingId) {
        Alert.alert("Cảnh báo", "Đặt lịch thành công nhưng không nhận được ID. Vui lòng kiểm tra lại trong danh sách đặt lịch.");
        return;
      }
      Alert.alert("Thành công", "Bạn đã đặt lịch thành công.");
      navigation.navigate("CheckoutScreen", { bookingId });

      setForm({
        clientName: "",
        address: "",
        phone: "",
        note: "",
        testServiceId: testServiceId || "",
        clientId: "",
        priceServiceId: priceServiceId || "",
        appointmentDate: new Date(),
      });
      console.log("handleSubmit success");
    } catch (error: any) {
      console.log("handleSubmit error:", error.message);
      Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đặt lịch xét nghiệm</Text>

        {/* Service Info Display */}
        {(testServiceId || priceServiceId) && (
          <View style={styles.serviceInfoCard}>
            <Text style={styles.serviceInfoTitle}>📋 Thông tin dịch vụ</Text>
            <View style={styles.serviceInfoRow}>
              <Text style={styles.serviceInfoLabel}>Mã dịch vụ:</Text>
              <Text style={styles.serviceInfoValue}>{testServiceId || "Chưa chọn"}</Text>
            </View>
            <View style={styles.serviceInfoRow}>
              <Text style={styles.serviceInfoLabel}>Mã giá:</Text>
              <Text style={styles.serviceInfoValue}>{priceServiceId || "Chưa chọn"}</Text>
            </View>
          </View>
        )}

        {/* Warning if missing service info */}
        {(!testServiceId || !priceServiceId) && (
          <View style={styles.warningCard}>
            <Icon name="alert-triangle" size={16} color="#f59e0b" />
            <Text style={styles.warningText}>
              Thiếu thông tin dịch vụ. Vui lòng quay lại và chọn dịch vụ trước khi đặt lịch.
            </Text>
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tên khách hàng</Text>
          <TextInput
            value={form.clientName}
            onChangeText={(text) => handleChange("clientName", text)}
            style={styles.input}
            placeholder="Nhập họ tên đầy đủ"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            value={form.address}
            onChangeText={(text) => handleChange("address", text)}
            style={styles.input}
            placeholder="Nhập địa chỉ liên hệ"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Nhập số điện thoại"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            value={form.note}
            onChangeText={(text) => handleChange("note", text)}
            style={styles.input}
            placeholder="Ghi chú thêm (tuỳ chọn)"
          />
        </View>

        {/* Ngày hẹn */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ngày hẹn</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Icon name="calendar" size={18} color="#555" style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>
              {form.appointmentDate.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>


        {showDatePicker && (
          <DateTimePicker
            value={form.appointmentDate}
            mode="datetime"
            is24Hour
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleChange("appointmentDate", selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !testServiceId || !priceServiceId}
          style={[
            styles.customButton,
            (loading || !testServiceId || !priceServiceId) && { opacity: 0.6 }
          ]}
        >
          <Text style={styles.customButtonText}>
            {loading ? "Đang xử lý..." :
              (!testServiceId || !priceServiceId) ? "Thiếu thông tin dịch vụ" :
                "Xác nhận đặt lịch"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  customButton: {
    borderWidth: 1,
    borderColor: "#90CAF9", // xanh dương dịu
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#E3F2FD", // nền xanh nhạt
    alignItems: "center",
    marginTop: 20,
  },
  customButtonText: {
    color: "#1565C0", // xanh đậm hơn
    fontSize: 16,
    fontWeight: "500",
  },
  serviceInfoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  serviceInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 12,
  },
  serviceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceInfoLabel: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  serviceInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    textAlign: "right",
  },
  warningCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fbbf24",
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    fontSize: 14,
    color: "#92400e",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  debugCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    fontFamily: "monospace",
  },
});
