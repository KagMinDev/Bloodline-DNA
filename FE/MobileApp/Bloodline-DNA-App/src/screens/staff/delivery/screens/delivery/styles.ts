import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  code: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#444",
  },
  note: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#666",
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    fontWeight: "700",
    backgroundColor: "#D0E4FF",
    padding: 5,
    fontSize: 14,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#007bff",
  },
  disabledBtn: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContent: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 12,
    color: "#333",
  },
});

export default styles;
