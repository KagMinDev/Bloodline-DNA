import { Dimensions, Platform, StyleSheet } from "react-native";

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
    fontSize: width > 768 ? 28 : 24, // text-2xl md:text-3xl
    fontWeight: "600", // font-bold
    color: "#333",
    textAlign: "center",
    marginBottom: 32, // mb-8
  },
  postCard: {
    flex: 1, // Chia đều không gian trong lưới
    padding: 24, // p-6
    backgroundColor: "#EFF6FF", // bg-blue-50
    borderWidth: 1, // border
    borderColor: "#BFDBFE", // border-blue-blue-100
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
  postTitle: {
    fontSize: width > 768 ? 20 : 18, // text-lg md:text-xl
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-gray-800
    marginBottom: 8, // mb-2
  },
  postDescription: {
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-gray-600
    marginBottom: 16, // mb-4
  },
  readMore: {
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
    color: "#2563EB", // text-blue-blue-600
  },
  columnWrapper: {
    justifyContent: "space-between", // space-between
  },
});