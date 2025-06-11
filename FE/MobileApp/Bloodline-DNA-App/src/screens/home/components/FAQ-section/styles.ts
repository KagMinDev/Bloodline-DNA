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
  },
  title: {
    fontSize: width > 768 ? 30 : 24, // text-2xl md:text-3xl
    fontWeight: "700", // font-bold
    color: "#1F2937", // text-gray-800
    textAlign: "center",
    marginBottom: 32, // mb-8
  },
  faqItem: {
    backgroundColor: "#FFFFFF", // bg-white
    borderRadius: 8, // rounded-lg
    marginBottom: 8, // Khoảng cách giữa các mục
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16, // p-4
  },
  question: {
    fontSize: width > 768 ? 18 : 16, // text-base
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-800
    flex: 1, // Chiếm không gian còn lại
  },
  icon: {
    marginLeft: 8,
  },
  answer: {
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-600
    paddingHorizontal: 16, // p-4
    paddingBottom: 16,
  },
});