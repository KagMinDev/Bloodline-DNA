import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfefe",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 50,
  },
  scrollContent: {
    paddingTop: 80, // Adjust based on your header height
    paddingBottom: 20,
  },
  section: {
    width: "100%",
    marginTop: 30, // Equivalent to mt-4 in Tailwind
  },
  contactSection: {
    marginTop: -16, // Equivalent to -mt-4 in Tailwind
  },
  footer: {
    marginTop: 32, // Equivalent to mt-8 in Tailwind
  },
});

export default styles;