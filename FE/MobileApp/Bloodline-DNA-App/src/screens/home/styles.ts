import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Màu nền tương tự blue-50
    paddingTop: 40
  },
  contentContainer: {
  },
  chatbotContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10, // Đảm bảo ChatbotAI nằm trên các thành phần khác
    padding: 16,
  },
});

export default styles;