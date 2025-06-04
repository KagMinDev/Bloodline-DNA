import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },
  contentContainer: {
    flexGrow: 1,
  },
  leftContainer: {
    backgroundColor: "#059669",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  dnaContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  dnaWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dnaStrand: {
    position: "absolute",
    left: 20,
    height: 80,
    justifyContent: "space-between",
  },
  dnaStrandRight: {
    left: 40,
  },
  dnaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  dnaConnector: {
    position: "absolute",
    width: 24,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    left: 28,
    top: 18,
  },
  activityIcon: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#60A5FA",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#D1FAE5",
    textAlign: "center",
    marginBottom: 24,
  },
  benefitsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  benefitText: {
    color: "#D1FAE5",
    marginLeft: 8,
    fontSize: 14,
  },
  trustContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
  },
  trustText: {
    fontSize: 12,
    color: "#D1FAE5",
    marginBottom: 8,
  },
  trustStats: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  trustNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 8,
  },
  trustLabel: {
    fontSize: 10,
    color: "#fff",
    opacity: 0.8,
    marginHorizontal: 8,
  },
  decorCircle: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  userPlusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#F87171",
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: "#1F2937",
  },
  inputIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  linkText: {
    color: "#059669",
    textDecorationLine: "underline",
  },
  registerButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#6EE7B7",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 6,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  loginLink: {
    color: "#059669",
    fontWeight: "600",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerLink: {
    fontSize: 12,
    color: "#6B7280",
    marginHorizontal: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
  },
});
