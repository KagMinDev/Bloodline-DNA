import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  code: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
    marginBottom: 10,
  },
  note: {
    fontStyle: "italic",
    color: "#6b7280",
    marginBottom: 15,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    fontSize: 13,
    fontWeight: "500",
    backgroundColor: "#C49E17",
    padding: 5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 5,
  },
  confirmText: {
    color: "#fff",
    marginLeft: 5,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalDetail: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
  },
  imagePicker: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelBtn: {
    backgroundColor: "#ddd",
  },
  okBtn: {
    backgroundColor: "#28a745",
  },
  cancelText: {
    color: "#000",
  },
  okText: {
    color: "#fff",
  },
});
