import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2563EB',
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  clientName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  text: {
    fontSize: 13,
    marginTop: 2,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});