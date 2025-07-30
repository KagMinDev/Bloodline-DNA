import { Dimensions, StyleSheet } from "react-native";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MENU_WIDTH = SCREEN_WIDTH * 0.8;

const styles = StyleSheet.create({
  header: {
    height: 48,
    top: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    borderRadius: 50,
    backgroundColor: "#007bff",
    padding: 4,
  },
  logoText: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  overlay: {
    position: "absolute",
    top: -20,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 98,
  },
  menuContainer: {
    position: "absolute",
    top: 48,
    right: 0,
    width: MENU_WIDTH,
    height: SCREEN_HEIGHT - 60,
    backgroundColor: "#fdfdfd",
    paddingVertical: 20,
    paddingHorizontal: 16,
    zIndex: 999,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  menuWelcome: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
    textDecorationLine: "underline",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#f0f4ff",
  },
  menuItemText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ff4d4d",
    fontSize: 14,
    textDecorationColor: "#ff4d4d",
    textDecorationLine: "underline",
  },
});

export default styles;