import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingTop: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    position: "relative", // Để menuButton dùng position: absolute
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB",
  },

  menuButton: {
    position: "absolute",
    bottom: 4,
    left: 45,
  },

  menuLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  staffName: {
    fontSize: 14,
    color: "#374151",
    marginRight: 8,
  },

  logoutBtn: {
    padding: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  modalMenu: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },

  modalMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  modalMenuText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#2563EB",
  },
});

export default styles;
