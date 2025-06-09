import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Tương tự bg-white/90
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2, // Tương tự shadow-sm
      },
    }),
    zIndex: 50, // Tương tự z-50
    paddingTop: Platform.OS === "ios" ? 44 : 0, // Điều chỉnh cho notch trên iOS
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, // Tương tự px-4 sm:px-6 lg:px-8
    paddingVertical: 12, // Tương tự py-4
    maxWidth: 1280, // Tương tự max-w-7xl
    width: "100%",
    alignSelf: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Tương tự space-x-3
  },
  logoIcon: {
    width: 40, // Tương tự w-10
    height: 40, // Tương tự h-10
    borderRadius: 20, // Tương tự rounded-full
    backgroundColor: "#2563EB", // Tương tự bg-blue-600
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20, // Tương tự text-2xl
    fontWeight: "700", // Tương tự font-bold
    color: "#1F2937", // Tương tự text-gray-800
  },
  navContainer: {
    flexDirection: "row",
    gap: 24, // Tương tự space-x-8
  },
  navItem: {
    paddingVertical: 4,
  },
  navText: {
    fontSize: 16,
    color: "#4B5563", // Tương tự text-gray-600
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // Tương tự space-x-4
  },
  loginText: {
    fontSize: 16,
    color: "#2563EB", // Tương tự text-blue-600
    fontWeight: "600", // Tương tự font-semibold
  },
  registerButton: {
    backgroundColor: "#2563EB", // Tương tự bg-blue-600
    paddingVertical: 10, // Tương tự size="large"
    paddingHorizontal: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4, // Tương tự shadow-lg
      },
    }),
  },
  registerText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;