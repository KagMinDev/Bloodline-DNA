import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F9FF",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e3a8a",
    fontStyle: "italic",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  code: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2563eb",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  note: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    fontWeight: "600",
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeBtn: {
    backgroundColor: "#10b981",
  },
  disabledBtn: {
    backgroundColor: "#d1d5db",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default styles;
