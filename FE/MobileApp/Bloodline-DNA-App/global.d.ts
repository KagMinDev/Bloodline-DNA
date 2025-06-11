import { Theme } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }

  // Extend theme types if using custom theming
  interface AppTheme extends Theme {
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      // Add your custom colors here
    };
  }
}