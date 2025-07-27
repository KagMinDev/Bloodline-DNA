import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { getTestKitByBookingIdApi, submitSampleInfoApi } from "../api/sampleApi";
import { SampleInfoPayload } from "../types/sampleInf";
import AsyncStorage from "@react-native-async-storage/async-storage";

const relationshipOptions = [
  { label: "Cha", value: "1" },
  { label: "Mẹ", value: "2" },
  { label: "Con", value: "3" },
  { label: "Ông nội", value: "4" },
  { label: "Bà nội", value: "5" },
  { label: "Anh trai", value: "7" },
  { label: "Chị/Em gái", value: "8" },
  { label: "Khác", value: "99" },
];

const sampleTypeOptions = [
  { label: "Tăm bông miệng", value: "1" },
  { label: "Máu", value: "2" },
  { label: "Tóc có chân tóc", value: "3" },
  { label: "Móng tay", value: "4" },
  { label: "Nước bọt", value: "5" },
  { label: "Khác", value: "99" },
];

interface SampleInfoModalAppProps {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
}

const SampleInfoModalApp: React.FC<SampleInfoModalAppProps> = ({
  visible,
  onClose,
  bookingId,
  onSuccess,
}) => {
  const [donorName, setDonorName] = useState("");
  const [relationshipToSubject, setRelationshipToSubject] = useState("1");
  const [sampleType, setSampleType] = useState("1");
  const [kitId, setKitId] = useState("");
  const [token, setToken] = useState("");
  const [loadingKit, setLoadingKit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy token khi mở modal
  useEffect(() => {
    const fetchTokenAndKit = async () => {
      if (!visible) return;

      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (!savedToken) {
          setError("Không tìm thấy token.");
          return;
        }
        setToken(savedToken);

        setLoadingKit(true);
        const res = await getTestKitByBookingIdApi(bookingId, savedToken);
        if (res.success && res.data?.id) {
          setKitId(res.data.id);
        } else {
          setError(res.message || "Không tìm thấy TestKit.");
        }
      } catch (e) {
        setError("Lỗi khi lấy thông tin TestKit.");
      } finally {
        setLoadingKit(false);
      }
    };

    fetchTokenAndKit();
  }, [visible, bookingId]);

  const handleSubmit = async () => {
    if (!kitId) {
      Alert.alert("Lỗi", "Không tìm thấy mã Kit.");
      return;
    }

    if (!donorName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người cho mẫu.");
      return;
    }

    const payload: SampleInfoPayload = {
      kitId,
      donorName: donorName.trim(),
      relationshipToSubject: parseInt(relationshipToSubject, 10),
      sampleType: parseInt(sampleType, 10),
    };

    try {
      setSubmitting(true);
      const res = await submitSampleInfoApi(payload, token);
      if (res.success) {
        Alert.alert("Thành công", "Gửi mẫu thành công.");
        onSuccess();
        onClose();
      } else {
        Alert.alert("Lỗi", res.message || "Không gửi được mẫu.");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", e.message || "Đã xảy ra lỗi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🧪 Điền thông tin mẫu xét nghiệm</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {loadingKit && (
          <View style={styles.infoBox}>
            <ActivityIndicator size="small" />
            <Text style={styles.infoText}>Đang tải thông tin TestKit...</Text>
          </View>
        )}

        {kitId ? (
          <View style={styles.successBox}>
            <Feather name="check-circle" size={18} color="#16a34a" />
            <Text style={styles.successText}>Mã TestKit: {kitId}</Text>
          </View>
        ) : null}

        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={18} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>Tên người cho mẫu *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ tên"
          value={donorName}
          onChangeText={setDonorName}
        />

        <Text style={styles.label}>Mối quan hệ với người đăng ký *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={relationshipToSubject}
            onValueChange={(value) => setRelationshipToSubject(value)}
          >
            {relationshipOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Loại mẫu *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sampleType}
            onValueChange={(value) => setSampleType(value)}
          >
            {sampleTypeOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting || loadingKit || !kitId}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Lưu thông tin</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default SampleInfoModalApp;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#1e3a8a" },
  label: { marginTop: 12, marginBottom: 4, fontWeight: "600", color: "#1e293b" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#64748b",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: { marginLeft: 8, color: "#1d4ed8" },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: { marginLeft: 8, color: "#15803d" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { marginLeft: 8, color: "#b91c1c" },
});
