// DeliveriesStaffTabs.tsx
import { DeliveriesStaffScreen, SampleReceived } from "@/screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export type DeliveriesTabParamList = {
  SampleReceived: undefined;
  ResultSent: undefined;
  DeliveriesStaff: undefined;
};

const Tab = createBottomTabNavigator<DeliveriesTabParamList>();

const DeliveriesStaffTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case "SampleReceived":
              iconName = "package-down";
              break;
            case "ResultSent":
              iconName = "send-check";
              break;
            case "DeliveriesStaff":
            default:
              iconName = "clipboard-list-outline";
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DeliveriesStaff"
        component={DeliveriesStaffScreen}
        options={{ tabBarLabel: "Giao Kit" }}
      />
      <Tab.Screen
        name="SampleReceived"
        component={SampleReceived}
        options={{ tabBarLabel: "Nhận mẫu Kit" }}
      />
    </Tab.Navigator>
  );
};

export default DeliveriesStaffTabs;
