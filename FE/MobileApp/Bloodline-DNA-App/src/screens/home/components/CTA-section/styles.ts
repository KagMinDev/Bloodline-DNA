import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 64, // py-16 md:py-20
    backgroundColor: "#EFF6FF", // bg-blue-50
  },
  content: {
    paddingHorizontal: 16, // px-4 sm:px-6 lg:px-8
    maxWidth: 1280, // max-w-7xl
    width: "100%",
    alignSelf: "center",
    alignItems: "center", // text-center
  },
  title: {
    fontSize: width >= 768 ? 30 : 24, // text-2xl md:text-3xl
    fontWeight: "700", // font-bold
    color: "#1F2937", // text-gray-800
    textAlign: "center",
    marginBottom: 24, // mb-6
  },
  description: {
    fontSize: width >= 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-600
    textAlign: "center",
    maxWidth: 672, // max-w-2xl
    marginBottom: 32, // mb-8
  },
  buttonContainer: {
    alignItems: "center",
    gap: 16, // gap-4
  },
  primaryButton: {
    backgroundColor: "#2563EB", // type="primary"
    paddingVertical: width >= 768 ? 12 : 8, // py-2 md:py-3
    paddingHorizontal: width >= 768 ? 24 : 16, // px-4 md:px-6
    borderRadius: 8,
    alignItems: "center",
    minWidth: 160,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    fontSize: width >= 768 ? 14 : 16, // md:text-sm
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2563EB", // border-blue-600
    backgroundColor: "transparent",
    paddingVertical: width >= 768 ? 12 : 8, // py-2 md:py-3
    paddingHorizontal: width >= 768 ? 24 : 16, // px-4 md:px-6
    borderRadius: 8,
    alignItems: "center",
    minWidth: 160,
  },
  secondaryButtonText: {
    fontSize: width >= 768 ? 14 : 16, // md:text-sm
    fontWeight: "600",
    color: "#2563EB", // text-blue-600
  },
});