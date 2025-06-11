import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5', // Màu trắng xám
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
  },
  largeCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(30, 58, 138, 0.1)', // blue-900 với opacity 10%
    top: '20%',
    right: '10%',
  },
  smallCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(29, 78, 216, 0.1)', // blue-700 với opacity 10%
    top: '-10%',
    left: '-10%',
  },
  mediumCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)', // blue-600 với opacity 10%
    top: '30%',
    left: '20%',
  },
  contentContainer: {
    maxWidth: '90%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a', // blue-900
  },
  titleIndicator: {
    width: 4,
    height: 32,
    backgroundColor: '#2563eb', // blue-600
    marginLeft: 12,
  },
  subtitleText: {
    fontSize: 16,
    color: '#1d4ed8', // blue-700
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#2563eb', // blue-600
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles;