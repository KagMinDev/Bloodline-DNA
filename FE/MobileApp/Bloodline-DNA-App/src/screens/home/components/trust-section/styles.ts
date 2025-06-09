import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 48, // py-12 md:py-16
  },
  content: {
    paddingHorizontal: 16, // px-4 sm:px-6 lg:px-8
    maxWidth: 1280, // max-w-7xl
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: width >= 768 ? 30 : 24, // text-2xl md:text-3xl
    fontWeight: "700", // font-bold
    color: "#FFFFFF", // text-white
    textAlign: "center",
    marginBottom: 32, // mb-8
  },
  indicatorsContainer: {
    alignItems: "center",
    gap: 24, // gap-6
  },
  indicator: {
    flex: 1, // flex-1
    alignItems: "center",
    paddingVertical: 8,
  },
  value: {
    fontSize: width >= 768 ? 40 : 32, // text-4xl md:text-5xl
    fontWeight: "700", // font-bold
    color: "#FFFFFF", // text-white
    marginBottom: 8, // mb-2
  },
  label: {
    fontSize: width >= 768 ? 18 : 16, // text-base md:text-lg
    color: "#FFFFFF", // text-white
  },
});