import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heroSection: {
    backgroundColor: '#0066CC',
    padding: 20,
    paddingTop: 60,
  },
  heroContent: {
    alignItems: 'center',
  },
  breadcrumb: {
    color: '#E0F7FA',
    fontSize: 14,
    marginBottom: 16,
  },
  breadcrumbLink: {
    color: '#B0C4DE',
  },
  breadcrumbActive: {
    color: '#00D4FF',
    fontWeight: '600',
  },
  heroTitle: {
    color: '#fff',
    bottom: 20,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroSubtitle: {
    top: 5,
    color: '#00D4FF',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '500',
  },
  heroDescription: {
    color: '#E0F7FA',
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 300,
  },
  contactSection: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    color: '#1E40AF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#4B5563',
    fontSize: 16,
    marginBottom: 16,
  },
  form: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  label: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonIcon: {
    marginRight: 8,
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderBottomColor: 'transparent',
    borderRadius: 10,
    marginRight: 8,
    // Animation would need a library like `react-native-reanimated`
  },
  contactInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  contactCardIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 12,
    marginBottom: 8,
  },
  contactCardTitle: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  contactCardDescription: {
    color: '#4B5563',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  contactCardValue: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '600',
  },
  mapSection: {
    padding: 20,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapPlaceholder: {
    color: '#4B5563',
    fontSize: 16,
    textAlign: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationCardTitle: {
    color: '#1E40AF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationCardText: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 8,
  },
  directionButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default styles;