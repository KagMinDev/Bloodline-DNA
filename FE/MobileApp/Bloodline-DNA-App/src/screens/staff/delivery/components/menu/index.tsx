import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actionsheet";

import { RootStackParamList } from "@/types/root-stack/stack.types";
import { styles } from "./styles";

const StaffMenuScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const mainMenuRef = useRef<ActionSheet>(null);
  const deliveryMenuRef = useRef<ActionSheet>(null);

  const mainMenuOptions = ["Quản lý đơn xét nghiệm", "Quản lý giao nhận Kit", "Huỷ"];
  const deliveryMenuOptions = ["Giao Kit", "Nhận mẫu Kit", "Gửi kết quả", "Huỷ"];

  const handleMainMenu = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate("Calendar");
        break;
      case 1:
        deliveryMenuRef.current?.show(); // show submenu
        break;
      default:
        break;
    }
  };

  const handleDeliveryMenu = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate("DeliveriesStaff", { tab: "Giao Kit" });
        break;
      case 1:
        navigation.navigate("DeliveriesStaff", { tab: "Nhận mẫu Kit" });
        break;
      case 2:
        navigation.navigate("DeliveriesStaff", { tab: "Gửi kết quả" });
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chức năng</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => mainMenuRef.current?.show()}
      >
        <MaterialCommunityIcons
          name="menu"
          size={24}
          color="#2563EB"
        />
        <Text style={styles.menuText}>Mở Menu Chức Năng</Text>
      </TouchableOpacity>

      {/* Menu chính */}
      <ActionSheet
        ref={mainMenuRef}
        title={"Chọn chức năng"}
        options={mainMenuOptions}
        cancelButtonIndex={2}
        onPress={handleMainMenu}
      />

      {/* Menu phụ */}
      <ActionSheet
        ref={deliveryMenuRef}
        title={"Quản lý giao nhận Kit"}
        options={deliveryMenuOptions}
        cancelButtonIndex={3}
        onPress={handleDeliveryMenu}
      />
    </View>
  );
};

export default StaffMenuScreen;
