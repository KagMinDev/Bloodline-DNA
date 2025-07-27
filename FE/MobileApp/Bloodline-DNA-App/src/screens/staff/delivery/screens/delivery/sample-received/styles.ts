import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: "#6b7280",
    fontSize: 14,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rowInfo: {
    flex: 1,
    paddingRight: 8,
  },
  code: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 6,
  },
  client: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  phone: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: "#6b7280",
  },
  rowRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "600",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnDisabled: {
    backgroundColor: "#cbd5e1",
  },
  btnText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 6,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  modalBtn: {
    minWidth: 90,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 12,
    paddingHorizontal: 16,
  },
  cancelBtn: {
    backgroundColor: "#f1f5f9",
  },
  okBtn: {
    backgroundColor: "#007bff",
  },
  cancelText: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "500",
  },
  okText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
