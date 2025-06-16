import { useAuth } from "@/context/auth/AuthContext";
import { RootStackParamList } from "@/types/root-stack/stack.types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MENU_WIDTH = SCREEN_WIDTH * 0.8;

const navItems = [
  { label: "Trang chủ", screen: "Home" },
  { label: "Về chúng tôi", screen: "About" },
  { label: "Dịch vụ", screen: "Services" },
  { label: "Các Bác Sĩ", screen: "Doctors" },
  { label: "Tin tức", screen: "News" },
  { label: "Liên hệ", screen: "Contact" },
];

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: MENU_WIDTH,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const toggleMenu = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const onSelectMenu = (screen: string) => {
    navigation.navigate(screen as never); // Chuyển trang
    closeMenu();
  };

  const getIconName = (screen: string) => {
    switch (screen) {
      case "Home":
        return "home-outline";
      case "About":
        return "information-outline";
      case "Services":
        return "briefcase-outline";
      case "Doctors":
        return "stethoscope";
      case "News":
        return "newspaper-variant-outline";
      case "Contact":
        return "phone-outline";
      default:
        return "menu";
    }
  };

  const handleLogout = async () => {
    await logout(); // ✅ tự động setIsLoggedIn(false)
  };

  return (
    <View style={{ zIndex: 100 }}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon style={styles.logoIcon} name="dna" size={24} color="#fff" />
          <Text style={styles.logoText}>ADN Huyết Thống</Text>
        </View>

        <TouchableOpacity onPress={toggleMenu}>
          <Icon
            name={menuVisible ? "close" : "menu"}
            size={30}
            color="#007bff"
          />
        </TouchableOpacity>
      </View>

      {/* Overlay mờ nền */}
      {menuVisible && <Pressable style={styles.overlay} onPress={closeMenu} />}

      {/* Menu trượt */}
      {menuVisible && (
        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.menuHeader}>
            <Icon name="account-circle" size={60} color="#007bff" />
            <Text style={styles.menuWelcome}>Xin chào!</Text>
          </View>

          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => onSelectMenu(item.screen)}
              style={styles.menuItem}
            >
              <Icon
                name={getIconName(item.screen)}
                size={18}
                color="#007bff"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            <AntDesign name="logout" size={12} color="#ff4d4d" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default Header;
