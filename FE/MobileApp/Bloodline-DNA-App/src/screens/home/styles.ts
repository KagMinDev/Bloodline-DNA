import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Màu nền tương tự blue-50
  },
  contentContainer: {
    paddingBottom: 20, // Khoảng cách dưới cùng để tránh bị che bởi ChatbotAI
  },
  chatbotContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10, // Đảm bảo ChatbotAI nằm trên các thành phần khác
    padding: 16,
  },
});

export default styles;