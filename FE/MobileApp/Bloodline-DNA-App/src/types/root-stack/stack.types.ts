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
  DeliveriesStaff: { tab: string };
  SampleReceived: undefined;
  ResultSent: undefined;
  StaffMenu: undefined;
  Calendar: undefined;
  BlogDetail: { id: string };
  Main: undefined;
  AllService: undefined;
  DetailsService: { id: string };
  AppointmentScreen: { testServiceId: string; priceServiceId: string };

  CheckoutScreen: { bookingId: string };
  WebViewScreen: { url: string };
  PaymentSuccess: {
    bookingId: string;
    orderCode?: string;
    amount?: number;
    paymentType?: "deposit" | "remaining";
  };
  PaymentError: {
    bookingId?: string;
    orderCode?: string;
    paymentType?: "deposit" | "remaining";
    message?: string;
  };
  TestPayment: undefined;
  BookingHistory: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Profile: undefined;
};
