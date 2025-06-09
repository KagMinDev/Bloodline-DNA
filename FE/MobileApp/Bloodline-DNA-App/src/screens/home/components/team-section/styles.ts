import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 64, // py-16 md:py-20
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
  memberCard: {
    flex: 1, // Chia đều không gian trong lưới
    padding: 16, // Khoảng cách nhỏ hơn so với p-6
    alignItems: "center",
    margin: 8, // gap-6
  },
  image: {
    width: width > 768 ? 128 : 96, // w-24 md:w-32
    height: width > 768 ? 128 : 96, // h-24 md:h-32
    borderRadius: 64, // rounded-full
    marginBottom: 16, // mb-4
  },
  name: {
    fontSize: width > 768 ? 18 : 16, // text-base md:text-lg
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-800
    marginBottom: 4,
  },
  titleText: {
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-600
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between", // Căn đều các cột
  },
});