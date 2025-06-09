import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 64, // py-16 md:py-20
  },
  content: {
    paddingHorizontal: 16, // px-4 sm:px-6 lg:px-8
    maxWidth: 1280, // max-w-7xl
    width: "100%",
    alignSelf: "center",
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#E5E7EB", // text-gray-200
    lineHeight: 24, // leading-relaxed
    marginBottom: 16, // mb-4
  },
  title: {
    fontSize: width > 768 ? 30 : 24, // text-2xl md:text-3xl
    fontWeight: "700", // font-bold
    color: "#FFFFFF", // text-white
    textAlign: "center",
    marginBottom: 32, // mb-8
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  testimonialCard: {
    width: width * 0.8, // 80% chiều rộng màn hình
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Nền bán trong suốt
    padding: 24, // p-6
    borderRadius: 12, // rounded-lg
    marginHorizontal: 8, // gap
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4, // shadow-md
      },
    }),
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 8, // mb-2
  },
  star: {
    marginRight: 4,
  },
  footer: {
    marginTop: "auto",
  },
  name: {
    fontSize: 16,
    fontWeight: "600", // font-semibold
    color: "#FFFFFF", // text-white
  },
  location: {
    fontSize: 14, // text-sm
    color: "#D1D5DB", // text-gray-300
  },
});
