import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window"); // Lấy kích thước

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    paddingVertical: 35, // Tương tự py-20 md:py-24
    paddingHorizontal: 16, // Tương tự px-4 sm:px-6 lg:px-8
  },
  content: {
    flexDirection: width > 768 ? "row" : "column", // md:flex-row
    alignItems: "center",
    maxWidth: 1280, // Tương tự max-w-7xl
    width: "100%",
    alignSelf: "center",
  },
  textContainer: {
    flex: width > 768 ? 1 : undefined, // md:w-1/2
    alignItems: width > 768 ? "flex-start" : "center", // md:text-left
    marginBottom: width > 768 ? 0 : 48, // mb-12 md:mb-0
  },
  title: {
    fontSize: width > 768 ? 36 : 28, // text-3xl md:text-4xl lg:text-5xl
    fontWeight: "700", // font-bold
    color: "#1F2937", // text-gray-800
    marginBottom: 24, // mb-6
    textAlign: width > 768 ? "left" : "center",
  },
  titleHighlight: {
    color: "#2563EB", // text-blue-600
  },
  description: {
    fontSize: width > 768 ? 16 : 14, // text-sm md:text-base
    color: "#4B5563", // text-gray-600
    marginBottom: 32, // mb-8
    maxWidth: 448, // max-w-lg
    textAlign: width > 768 ? "left" : "center",
  },
  button: {
    backgroundColor: "#2563EB", // Tương tự type="primary"
    paddingVertical: width > 768 ? 12 : 8, // py-2 md:py-3
    paddingHorizontal: width > 768 ? 24 : 16, // px-4 md:px-6
    borderRadius: 8,
  },
  buttonText: {
    fontSize: width > 768 ? 14 : 16, // md:text-sm
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
  imageContainer: {
    flex: width > 768 ? 1 : undefined, // md:w-1/2
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dnaWrapper: {
    width: width > 768 ? 320 : 256, // w-64 md:w-80
    height: width > 768 ? 320 : 256, // h-64 md:h-80
    borderRadius: 160, // rounded-full
    backgroundColor: "rgba(37, 99, 235, 0.1)", // bg-blue-600/10
    justifyContent: "center",
    alignItems: "center",
  },
  decorCircle1: {
    position: "absolute",
    width: width > 768 ? 64 : 48, // w-12 md:w-16
    height: width > 768 ? 64 : 48, // h-12 md:h-16
    borderRadius: 32,
    backgroundColor: "rgba(96, 165, 250, 0.2)", // bg-blue-400/20
  },
  decorCircle2: {
    position: "absolute",
    width: width > 768 ? 48 : 32, // w-8 md:w-12
    height: width > 768 ? 48 : 32, // h-8 md:h-12
    borderRadius: 24,
    backgroundColor: "rgba(191, 219, 254, 0.2)", // bg-blue-200/20
  },
  decorCircle3: {
    position: "absolute",
    width: width > 768 ? 40 : 32, // w-8 md:w-10
    height: width > 768 ? 40 : 32, // h-8 md:h-10
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // bg-white/10
  },
});

export default styles;