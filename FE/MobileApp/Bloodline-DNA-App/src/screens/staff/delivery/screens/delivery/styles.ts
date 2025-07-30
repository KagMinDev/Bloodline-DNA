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

  // Thêm các styles này vào file styles.ts

tabContainer: {
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
  paddingVertical: 8,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

tabScrollContent: {
  paddingHorizontal: 16,
  alignItems: 'center',
},

tabButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
  marginHorizontal: 4,
  borderRadius: 20,
  backgroundColor: '#F3F4F6',
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

activeTabButton: {
  backgroundColor: '#3B82F6',
  borderColor: '#3B82F6',
},

tabButtonText: {
  marginLeft: 8,
  fontSize: 14,
  fontWeight: '600',
  color: '#6B7280',
},

activeTabButtonText: {
  color: '#FFFFFF',
},

emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 64,
},

emptyText: {
  marginTop: 16,
  fontSize: 16,
  color: '#6B7280',
  textAlign: 'center',
},
});

export default styles;
