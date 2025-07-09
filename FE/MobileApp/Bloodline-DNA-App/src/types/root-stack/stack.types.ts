export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Services: undefined;
  Contact: undefined;
  About: undefined;
  Doctors: undefined;
  News: undefined;
  BlogDetail: { id: string };
  Main: undefined;
  AllService: undefined;
  DetailsService: { id: string };
  AppointmentScreen: { serviceId: string };
  StaffDashboard: undefined;
};


export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Profile: undefined;
};