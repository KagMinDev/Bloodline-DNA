import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    marginLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#2563EB",
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
    paddingBottom: 8,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#9CA3AF",
    marginTop: 8,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
  },
  subLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 2,
  },
  value: {
    fontWeight: "500",
    color: "#111827",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  statusTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
});