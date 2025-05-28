import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  contentContainer: {
    flexGrow: 1,
  },
  leftContainer: {
    backgroundColor: '#2563EB',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dnaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dnaWrapper: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dnaStrand: {
    position: 'absolute',
    left: 20,
    height: 80,
    justifyContent: 'space-between',
  },
  dnaStrandRight: {
    left: 40,
  },
  dnaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dnaConnector: {
    position: 'absolute',
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    left: 28,
    top: 18,
  },
  heartIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureText: {
    color: '#BFDBFE',
    marginLeft: 8,
    fontSize: 14,
  },
  decorCircle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#1F2937',
  },
  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    padding: 8,
  },
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#2563EB',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  registerLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
});