import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  spinner: {
    width: 50, // Kích thước của spinner
    height: 50, // Kích thước của spinner
    borderRadius: 40, // Tạo hình tròn
    borderWidth: 8,
    borderColor: "rgba(0, 0, 0, 0.1)", // Màu nhạt cho vòng ngoài
    borderTopColor: "#3498db", // Màu chính cho phần xoay
    borderStyle: "solid", // Đảm bảo đường viền liền mạch
  },
});

export default styles;
