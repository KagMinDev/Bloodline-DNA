import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Feather";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TestBookingRequest } from "../types/testBooking";
import { createTestBookingApi } from "../api/testbookingApi";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AppointmentScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "AppointmentScreen">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { testServiceId, priceServiceId } = route.params || {};

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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadClientId = async () => {
      const clientId = await AsyncStorage.getItem("clientId");
      if (clientId) setForm(prev => ({ ...prev, clientId }));
    };
    loadClientId();
  }, []);

  const handleChange = (field: keyof typeof form, value: string | Date) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!testServiceId || !priceServiceId) {
      Alert.alert("Thiếu thông tin", "Vui lòng quay lại và chọn dịch vụ.");
      return;
    }

    if (!form.clientName.trim() || !form.phone.trim() || !form.address.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    try {
      const payload: TestBookingRequest = {
        ...form,
        appointmentDate: form.appointmentDate.toISOString(),
      };
      const result = await createTestBookingApi(payload);
      const bookingId = typeof result === "string" ? result : result?.id;
      if (!bookingId) throw new Error("Không lấy được ID");

      Alert.alert("Thành công", "Đặt lịch thành công.");
      navigation.navigate("CheckoutScreen", { bookingId });

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
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#2563eb" />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}> Đặt lịch xét nghiệm</Text>

        {/* Form fields */}
        {[
          { label: "Tên khách hàng", key: "clientName", icon: "user" },
          { label: "Địa chỉ", key: "address", icon: "map-pin" },
          { label: "Số điện thoại", key: "phone", icon: "phone", keyboard: "phone-pad" },
          { label: "Ghi chú", key: "note", icon: "file-text" },
        ].map(({ label, key, icon, keyboard }) => (
          <View key={key} style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
              <Icon name={icon} size={16} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={(form as any)[key]}
                onChangeText={(text) => handleChange(key as any, text)}
                placeholder={`Nhập ${label.toLowerCase()}`}
              />
            </View>
          </View>
        ))}

        {/* Ngày hẹn */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Thời gian hẹn</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <MCIcon name="calendar-clock" size={20} color="#2563eb" style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>{form.appointmentDate.toLocaleString("vi-VN")}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={form.appointmentDate}
            mode="datetime"
            is24Hour
            display="default"
            onChange={(_, date) => {
              if (date) handleChange("appointmentDate", date);
              setShowDatePicker(false);
            }}
          />
        )}

        {/* Submit button */}
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
    paddingBottom: 50,
    paddingTop: 90
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    fontSize: 15,
    color: "#2563eb",
    marginLeft: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 14,
    color: "#2563eb",
  },
  customButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  customButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
