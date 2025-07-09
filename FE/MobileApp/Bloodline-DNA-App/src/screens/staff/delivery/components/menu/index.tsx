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
  const actionSheetRef = useRef<ActionSheet>(null);

  const menuOptions = ["Quản lý đơn xét nghiệm", "Quản lý giao nhận Kit", "Huỷ"];
  
  const handleMenuPress = (index: number) => {
    if (index === 0) {
      navigation.navigate("Calendar");
    } else if (index === 1) {
      navigation.navigate("DeliveriesStaff");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chức năng</Text>

      {/* Icon mở ActionSheet */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => actionSheetRef.current?.show()}
      >
        <MaterialCommunityIcons
          name="menu"
          size={24}
          color="#2563EB"
        />
        <Text style={styles.menuText}>Mở Menu Chức Năng</Text>
      </TouchableOpacity>

      {/* ActionSheet */}
      <ActionSheet
        ref={actionSheetRef}
        title={"Chuyển đến màn hình"}
        options={menuOptions}
        cancelButtonIndex={2}
        onPress={handleMenuPress}
      />
    </View>
  );
};

export default StaffMenuScreen;
