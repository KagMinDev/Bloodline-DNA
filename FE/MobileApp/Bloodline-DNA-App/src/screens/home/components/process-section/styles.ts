import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 64, // Tương tự py-16 md:py-20
    backgroundColor: "#EFF6FF", // bg-blue-50
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
  stepCard: {
    flex: 1, // Chia đều không gian trong lưới
    padding: 24, // p-6
    alignItems: "center",
    margin: 8, // gap-6
  },
  iconContainer: {
    width: 64, // w-16
    height: 64, // h-16
    borderRadius: 32, // rounded-full
    backgroundColor: "rgba(37, 99, 235, 0.1)", // bg-blue-600/10
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16, // mb-4
  },
  icon: {},
  stepTitle: {
    fontSize: width > 768 ? 18 : 16, // text-base md:text-lg
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-800
    marginBottom: 8, // mb-2
  },
  stepDescription: {
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-600
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between", // Căn đều các cột
  },
});
