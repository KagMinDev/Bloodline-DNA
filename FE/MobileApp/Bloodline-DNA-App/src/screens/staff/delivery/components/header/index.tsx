import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useAuth } from "@/context/auth/AuthContext";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import styles from "./styles";

const HeaderStaff: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, userName } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNavigate = <T extends keyof RootStackParamList>(screen: T) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.header}>
      {/* Logo và tên app */}
      <View style={styles.leftSection}>
        <Icon name="hospital-building" size={20} color="#2563EB" />
        <Text style={styles.logoText}>Hệ Thống Giao Kit</Text>
      </View>

      {/* Nút menu ở góc trái */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
      >
        <Text style={styles.menuLabel}>Menu</Text>
      </TouchableOpacity>

      {/* Xin chào + logout bên phải */}
      <View style={styles.rightSection}>
        <Text style={styles.staffName}>
          👋 Xin chào,{" "}
          <Text style={{ color: "#2563EB" }}>{userName || "Nhân viên"}</Text>
        </Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Modal menu chọn chức năng */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.modalMenu}>
            <Text style={styles.modalTitle}>Chọn chức năng</Text>

            <TouchableOpacity
              style={styles.modalMenuItem}
              onPress={() => handleNavigate("Calendar")}
            >
              <Icon name="calendar-check" size={20} color="#2563EB" />
              <Text style={styles.modalMenuText}>Quản lý đơn xét nghiệm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalMenuItem}
              onPress={() => handleNavigate("DeliveriesStaff")}
            >
              <Icon name="truck-delivery" size={20} color="#2563EB" />
              <Text style={styles.modalMenuText}>Quản lý giao nhận Kit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HeaderStaff;
