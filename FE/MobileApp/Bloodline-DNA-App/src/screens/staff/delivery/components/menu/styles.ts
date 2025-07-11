import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#E0ECFF",
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 8,
    color: "#2563EB",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
  },
  menuWithSubmenu: {
  marginBottom: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

parentMenuItem: {
  justifyContent: 'space-between',
  backgroundColor: '#F8FAFC',
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
},

submenuContainer: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: '#FFFFFF',
},

submenuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginVertical: 4,
  backgroundColor: '#F9FAFB',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

submenuText: {
  marginLeft: 12,
  fontSize: 14,
  color: '#374151',
  fontWeight: '500',
},
});
