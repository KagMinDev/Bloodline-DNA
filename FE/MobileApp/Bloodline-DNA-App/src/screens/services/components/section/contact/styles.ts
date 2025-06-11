import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_MARGIN = width * 0.05;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  subHeader: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  headerLine: {
    width: 50,
    height: 3,
    backgroundColor: '#3b82f6',
    marginBottom: 16,
  },
  headerText: {
    textAlign: 'center',
    color: '#4b5563',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 2,
  },
});

export default styles;