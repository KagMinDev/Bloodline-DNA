// AppRouter.tsx
import { useAuth } from "@/context/auth/AuthContext";
import AppointmentScreen from "@/screens/appoiment/screen/Appoiments";
import BlogsScreen from "@/screens/blogs";
import BlogDetailsScreen from "@/screens/blogsDetails/BlogDetails";
import BookingHistory from "@/screens/booking-history/screen/BookingHistory";
import WebViewScreen from "@/screens/checkout/components/WebViewScreen";
import CheckoutScreen from "@/screens/checkout/screen/Checkout";
import ContactScreen from "@/screens/contact";
import DoctorsScreen from "@/screens/doctors";
import PaymentError from "@/screens/payment/screen/PaymentError";
import PaymentSuccess from "@/screens/payment/screen/PaymentSuccess";
import Services from "@/screens/services";
import DetailService from "@/screens/services/components/AllServices/DetailService";
import AllServiceScreen from "@/screens/services/screen/AllServiceScreen";
import DeliveriesStaffTabs from "@/screens/staff/delivery/types/bottomTab.types";
import ProfileScreen from "@/screens/user/screen/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ForgotPasswordScreen, HomePageScreen, LoginScreen, RegisterScreen } from "../screens";
import { MainTabParamList, RootStackParamList, } from "../types/root-stack/stack.types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Bottom Tabs Navigator
const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<MainTabParamList, keyof MainTabParamList>;
      }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
        },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: string;
          if (route.name === "Services") {
            iconName = "calendar";
          } else {
            iconName = "account";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePageScreen}
        options={{ tabBarLabel: "Trang chủ" }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{ tabBarLabel: "Dịch vụ" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Hồ sơ" }}
      />
    </Tab.Navigator>
  );
};

const AppRouter: React.FC = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Doctors" component={DoctorsScreen} />
          <Stack.Screen name="Blogs" component={BlogsScreen} />
          <Stack.Screen name="Services" component={Services} />
          <Stack.Screen name="BlogDetailsScreen" component={BlogDetailsScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="DeliveriesStaffTabs" component={DeliveriesStaffTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />


          <Stack.Screen name="AllService" component={AllServiceScreen} />
          <Stack.Screen name="DetailsService" component={DetailService} />
          <Stack.Screen  name="AppointmentScreen" component={AppointmentScreen} />

          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
          <Stack.Screen name="PaymentError" component={PaymentError} />
          <Stack.Screen name="BookingHistory" component={BookingHistory} />
          <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ title: "Thanh toán" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppRouter;
