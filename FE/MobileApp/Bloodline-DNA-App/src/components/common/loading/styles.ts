import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5, // Làm mờ nền
    zIndex: -1, // Đảm bảo backdrop nằm phía sau nội dung
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white', // hoặc 'transparent' nếu bạn muốn nền trong
    borderRadius: 12,
    zIndex: 1,
  },
  inline: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  card: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medical: {
    padding: 32,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
  },
  medicalText: {
    marginTop: 16,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  dotsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563EB',
    minHeight: 24,
  },
});

export default styles;
