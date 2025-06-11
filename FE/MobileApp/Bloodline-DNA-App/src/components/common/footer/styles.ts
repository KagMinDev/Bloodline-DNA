import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF", // bg-white
    borderTopWidth: 1, // border-t
    borderTopColor: "#F0F5FF", // border-blue-100
  },
  content: {
    paddingHorizontal: 24, // px-6
    paddingVertical: 48, // py-12
    maxWidth: 1280, // max-w-7xl
    width: "100%",
    alignSelf: "center",
  },
  gridContainer: {
    gap: 40, // gap-10
  },
  section: {
    flex: 1,
    marginBottom: width < 768 ? 32 : 0,
  },
  logo: {
    fontSize: 24, // text-2xl
    fontWeight: "700", // font-bold
    color: "#1E3A8A", // text-blue-800
    marginBottom: 16, // mb-4
  },
  aboutText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-600
    lineHeight: 20, // leading-relaxed
  },
  sectionTitle: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    color: "#1D4ED8", // text-blue-700
    marginBottom: 16, // mb-4
  },
  linkItem: {
    paddingVertical: 4, // space-y-2
  },
  linkText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-600
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6, // space-y-3
  },
  contactIcon: {
    marginRight: 8, // gap-2
    marginTop: 2,
  },
  contactText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-600
  },
  bottomContainer: {
    marginTop: 48, // mt-12
    paddingTop: 32, // pt-8
    borderTopWidth: 1, // border-t
    borderTopColor: "#E5E7EB", // border-gray-200
    alignItems: "center",
  },
  copyright: {
    fontSize: 14, // text-sm
    color: "#6B7280", // text-gray-500
    marginBottom: 8,
  },
  bottomLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // gap-4
  },
  bottomLink: {
    fontSize: 14, // text-sm
    color: "#6B7280", // text-gray-500
  },
  bottomSeparator: {
    fontSize: 14,
    color: "#6B7280",
  },
});