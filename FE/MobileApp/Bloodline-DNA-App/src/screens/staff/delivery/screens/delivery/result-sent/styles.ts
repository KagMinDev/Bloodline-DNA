import { StyleSheet } from "react-native";

const PRIMARY_COLOR = "#007bff";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  row: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rowInfo: {
    marginBottom: 12,
  },
  code: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 2,
  },
  tag: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  actionWrapper: {
    alignItems: "flex-end",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 13,
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
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  modalText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalBtn: {
    minWidth: 80,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    marginLeft: 12,
  },
  cancelBtn: {
    backgroundColor: "#e5e7eb",
  },
  cancelText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  okBtn: {
    backgroundColor: PRIMARY_COLOR,
  },
  okText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
});
