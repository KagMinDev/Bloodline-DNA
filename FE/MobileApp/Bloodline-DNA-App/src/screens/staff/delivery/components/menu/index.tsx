import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList } from "@/types/root-stack/stack.types";
import { styles } from "./styles";

const StaffMenuScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [mainMenuVisible, setMainMenuVisible] = useState(false);
  const [deliveryMenuVisible, setDeliveryMenuVisible] = useState(false);
  const [showDeliverySubmenu, setShowDeliverySubmenu] = useState(true);

  const openMainMenu = () => setMainMenuVisible(true);
  const closeMainMenu = () => setMainMenuVisible(false);

  const openDeliveryMenu = () => {
    console.log("Opening delivery menu");
    closeMainMenu();
    setDeliveryMenuVisible(true);
  };
  const closeDeliveryMenu = () => setDeliveryMenuVisible(false);

  const toggleDeliverySubmenu = () => {
    setShowDeliverySubmenu(!showDeliverySubmenu);
  };

  const handleMainMenu = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate("Calendar");
        closeMainMenu();
        break;
      case 1:
        openDeliveryMenu();
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
    }
    closeDeliveryMenu();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chức năng</Text>

      {/* Menu chính hiển thị trên UI */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Calendar")}
      >
        <MaterialCommunityIcons name="calendar" size={24} color="#2563EB" />
        <Text style={styles.menuText}>Quản lý đơn xét nghiệm</Text>
      </TouchableOpacity>

      {/* Menu giao nhận Kit với submenu */}
      <View style={styles.menuWithSubmenu}>
        <TouchableOpacity
          style={[styles.menuItem, styles.parentMenuItem]}
          onPress={toggleDeliverySubmenu}
        >
          <MaterialCommunityIcons
            name="truck-delivery"
            size={24}
            color="#2563EB"
          />
          <Text style={styles.menuText}>Quản lý giao nhận Kit</Text>
          <MaterialCommunityIcons
            name={showDeliverySubmenu ? "chevron-up" : "chevron-down"}
            size={20}
            color="#2563EB"
          />
        </TouchableOpacity>

        {/* Submenu giao nhận Kit */}
        {showDeliverySubmenu && (
          <View style={styles.submenuContainer}>
            <TouchableOpacity
              style={styles.submenuItem}
              onPress={() =>
                navigation.navigate("DeliveriesStaff", { tab: "Giao Kit" })
              }
            >
              <MaterialCommunityIcons
                name="truck-outline"
                size={20}
                color="#059669"
              />
              <Text style={styles.submenuText}>Giao Kit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submenuItem}
              onPress={() =>
                navigation.navigate("DeliveriesStaff", { tab: "Nhận mẫu Kit" })
              }
            >
              <MaterialCommunityIcons
                name="package-variant"
                size={20}
                color="#059669"
              />
              <Text style={styles.submenuText}>Nhận mẫu Kit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submenuItem}
              onPress={() =>
                navigation.navigate("DeliveriesStaff", { tab: "Gửi kết quả" })
              }
            >
              <MaterialCommunityIcons
                name="email-send"
                size={20}
                color="#059669"
              />
              <Text style={styles.submenuText}>Gửi kết quả</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Giữ lại các modal cũ để backup */}
      <TouchableOpacity style={styles.menuItem} onPress={openMainMenu}>
        <MaterialCommunityIcons name="menu" size={24} color="#2563EB" />
        <Text style={styles.menuText}>Mở Menu Modal (Backup)</Text>
      </TouchableOpacity>

      {/* Main Menu Modal */}
      <Modal visible={mainMenuVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={closeMainMenu}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Chọn chức năng</Text>
            <TouchableOpacity
              onPress={() => handleMainMenu(0)}
              style={styles.modalItem}
            >
              <Text>Quản lý đơn xét nghiệm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleMainMenu(1)}
              style={styles.modalItem}
            >
              <Text>Quản lý giao nhận Kit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeMainMenu} style={styles.modalItem}>
              <Text>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Delivery Menu Modal */}
      <Modal visible={deliveryMenuVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={closeDeliveryMenu}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Quản lý giao nhận Kit</Text>
            <TouchableOpacity
              onPress={() => handleDeliveryMenu(0)}
              style={styles.modalItem}
            >
              <Text>Giao Kit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeliveryMenu(1)}
              style={styles.modalItem}
            >
              <Text>Nhận mẫu Kit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeliveryMenu(2)}
              style={styles.modalItem}
            >
              <Text>Gửi kết quả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeDeliveryMenu}
              style={styles.modalItem}
            >
              <Text>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default StaffMenuScreen;
