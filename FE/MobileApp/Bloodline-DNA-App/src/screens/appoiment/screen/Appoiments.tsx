import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity,} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TestBookingRequest } from "../types/testBooking";
import { createTestBookingApi } from "../api/testbookingApi";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AppointmentScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "AppointmentScreen">>();
  const { testServiceId, priceServiceId } = route.params;
  const [form, setForm] = useState<
    Omit<TestBookingRequest, "appointmentDate"> & { appointmentDate: Date }
  >({
    clientName: "",
    address: "",
    phone: "",
    note: "",
    testServiceId,
    clientId: "",
    priceServiceId,
    appointmentDate: new Date(),
  });



  // Load clientId from AsyncStorage when component mounts
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
    setLoading(true);
    try {
      const payload: TestBookingRequest = {
        ...form,
        appointmentDate: form.appointmentDate.toISOString(),
      };

      await createTestBookingApi(payload);
      Alert.alert("Thành công", "Bạn đã đặt lịch thành công.");
      setForm({
        clientName: "",
        address: "",
        phone: "",
        note: "",
        testServiceId,
        clientId: "",
        priceServiceId,
        appointmentDate: new Date(),
      });
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
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleChange("appointmentDate", selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.customButton, loading && { opacity: 0.6 }]}
        >
          <Text style={styles.customButtonText}>
            {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
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
});
