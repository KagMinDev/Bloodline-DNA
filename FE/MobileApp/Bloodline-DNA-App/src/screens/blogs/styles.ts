import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 80, // chiều cao header cố định
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  mainContent: {
    flexDirection: "row",
    gap: 16, // chỉ hỗ trợ trên RN >= 0.71, nếu thấp có thể dùng margin
    justifyContent: "space-between",
  },
  postList: {
    flex: 3,
  },
  sidebar: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  retryText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
