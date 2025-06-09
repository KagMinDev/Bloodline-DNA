import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 64, // Tương tự py-16 md:py-20
    backgroundColor: "#FFFFFF", // bg-white
  },
  content: {
    paddingHorizontal: 16, // px-4 sm:px-6 lg:px-8
    maxWidth: 1280, // max-w-7xl
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: width > 768 ? 30 : 24, // text-2xl md:text-3xl
    fontWeight: "700", // font-bold
    color: "#1F2937", // text-gray-800
    textAlign: "center",
    marginBottom: 32, // mb-8
  },
  featureCard: {
    flex: 1, // Chia đều không gian trong lưới
    padding: 24, // p-6
    alignItems: "center",
    backgroundColor: "#EFF6FF", // bg-blue-50
    borderWidth: 1, // border
    borderColor: "#BFDBFE", // border-blue-200
    borderRadius: 8, // rounded-lg
    margin: 8, // gap-6
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2, // shadow-md
      },
    }),
  },
  icon: {
    marginBottom: 16, // mb-4
  },
  featureTitle: {
    fontSize: width > 768 ? 20 : 18, // text-lg md:text-xl
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-800
    marginBottom: 8, // mb-2
  },
  featureDescription: {
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-600
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between", // Đảm bảo các cột căn đều
  },
});