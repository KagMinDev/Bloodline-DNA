// AppRouter.tsx
import { useAuth } from "@/context/auth/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ForgotPasswordScreen, HomePageScreen, LoginScreen, RegisterScreen } from "../screens";
import {
  MainTabParamList,
  RootStackParamList,
} from "../types/root-stack/stack.types";

// ... (giữ nguyên các component Placeholder screens)
const ProfileScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F0F9FF",
    }}
  >
    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile Screen</Text>
  </View>
);

const AppointmentsScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F0F9FF",
    }}
  >
    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
      Appointments Screen
    </Text>
  </View>
);

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
          if (route.name === "Appointments") {
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
        name="Appointments"
        component={AppointmentsScreen}
        options={{ tabBarLabel: "Lịch hẹn" }}
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
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
  );

};

export default AppRouter;