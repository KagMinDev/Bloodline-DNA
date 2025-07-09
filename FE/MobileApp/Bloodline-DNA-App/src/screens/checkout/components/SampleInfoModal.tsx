import React, { useState } from "react";
import {View,Text,Modal,StyleSheet,TouchableOpacity,TextInput,ScrollView,Alert,} from "react-native";
import { Feather } from "@expo/vector-icons";

interface SampleInfoModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  onSubmit: (sampleInfo: SampleInfo) => void;
}

interface SampleInfo {
  sampleType: string;
  collectionDate: string;
  notes: string;
  participantName: string;
  participantAge: string;
}

const SampleInfoModal: React.FC<SampleInfoModalProps> = ({
  visible,
  onClose,
  bookingId,
  onSubmit,
}) => {
  const [sampleInfo, setSampleInfo] = useState<SampleInfo>({
    sampleType: "Nước bọt",
    collectionDate: new Date().toISOString().split('T')[0],
    notes: "",
    participantName: "",
    participantAge: "",
  });

  const handleSubmit = () => {
    if (!sampleInfo.participantName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người tham gia");
      return;
    }
    if (!sampleInfo.participantAge.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tuổi người tham gia");
      return;
    }

    onSubmit(sampleInfo);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📝 Thông tin mẫu xét nghiệm</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            Mã đặt lịch: <Text style={styles.bookingId}>{bookingId}</Text>
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên người tham gia *</Text>
            <TextInput
              style={styles.input}
              value={sampleInfo.participantName}
              onChangeText={(text) =>
                setSampleInfo({ ...sampleInfo, participantName: text })
              }
              placeholder="Nhập tên người tham gia xét nghiệm"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tuổi *</Text>
            <TextInput
              style={styles.input}
              value={sampleInfo.participantAge}
              onChangeText={(text) =>
                setSampleInfo({ ...sampleInfo, participantAge: text })
              }
              placeholder="Nhập tuổi"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Loại mẫu</Text>
            <TextInput
              style={styles.input}
              value={sampleInfo.sampleType}
              onChangeText={(text) =>
                setSampleInfo({ ...sampleInfo, sampleType: text })
              }
              placeholder="Loại mẫu xét nghiệm"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ngày lấy mẫu</Text>
            <TextInput
              style={styles.input}
              value={sampleInfo.collectionDate}
              onChangeText={(text) =>
                setSampleInfo({ ...sampleInfo, collectionDate: text })
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ghi chú</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={sampleInfo.notes}
              onChangeText={(text) =>
                setSampleInfo({ ...sampleInfo, notes: text })
              }
              placeholder="Ghi chú thêm (tùy chọn)"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#2563eb" />
            <Text style={styles.infoText}>
              Sau khi điền thông tin, vui lòng gửi mẫu theo địa chỉ được cung cấp trong kit.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SampleInfoModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
  },
  bookingId: {
    fontWeight: "bold",
    color: "#2563eb",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    marginLeft: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#2563eb",
  },
  submitButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
