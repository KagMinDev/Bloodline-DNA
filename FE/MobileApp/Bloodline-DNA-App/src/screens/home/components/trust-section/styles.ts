import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2563EB", // Màu chính
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  // Tạo hiệu ứng gradient bằng pseudo-element
  containerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E40AF', // Màu gradient
    opacity: 0.7,
  },
  content: {
    zIndex: 1,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  indicatorsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  indicator: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  value: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
});
