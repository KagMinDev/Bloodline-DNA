import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useAuth } from "@/context/auth/AuthContext";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import styles from "./styles";

const HeaderStaff: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, userName } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDeliverySubmenu, setShowDeliverySubmenu] = useState(false);

  const handleLogout = async () => {
  await logout();
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
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalMenu}>
              <Text style={styles.modalTitle}>Chọn chức năng</Text>


              {/* Quản lý giao nhận Kit */}
              <TouchableOpacity
                style={styles.modalMenuItem}
                onPress={() =>
                  setShowDeliverySubmenu((prev) => !prev)
                }
              >
                <Icon name="truck-delivery" size={20} color="#2563EB" />
                <Text style={styles.modalMenuText}>Quản lý giao nhận Kit</Text>
                <Icon
                  name={showDeliverySubmenu ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#2563EB"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              {/* Submenu */}
              {showDeliverySubmenu && (
                <View style={{ paddingLeft: 32 }}>
                  <TouchableOpacity
                    style={styles.modalMenuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      setShowDeliverySubmenu(false);
                      navigation.navigate("DeliveriesStaff", {
                        tab: "Giao Kit",
                      });
                    }}
                  >
                    <Text style={styles.modalMenuText}>• Giao Kit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalMenuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      setShowDeliverySubmenu(false);
                      navigation.navigate("SampleReceived");
                    }}
                  >
                    <Text style={styles.modalMenuText}>• Nhận mẫu Kit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
};

export default HeaderStaff;
