import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // px-4
  },
  content: {
    alignItems: "center",
    textAlign: "center",
  },
  iconWrapper: {
    marginBottom: 24, // mb-6
  },
  dnaContainer: {
    width: width >= 768 ? 96 : 64, // w-16 md:w-24
    height: width >= 768 ? 96 : 64, // h-16 md:h-24
  },
  errorCode: {
    fontSize: width >= 768 ? 72 : 48, // text-5xl md:text-7xl
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  title: {
    fontSize: width >= 768 ? 30 : 24, // text-2xl md:text-3xl
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  description: {
    fontSize: width >= 768 ? 16 : 14, // text-base
    color: "#4B5563",
    maxWidth: 320,
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});