
export interface ContactInfo {
  id: number;
  title: string;
  description: string;
  value: string;
  icon: string; // Use icon names for react-native-vector-icons
  type: 'phone' | 'email' | 'address' | 'hours';
  link?: string;
}

export interface OfficeHour {
  day: string;
  hours: string;
  isToday?: boolean;
}
