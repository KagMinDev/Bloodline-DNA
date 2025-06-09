import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  // Khởi tạo menu ở ngoài màn hình bên phải (dịch sang phải bằng MENU_WIDTH)
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // menu trượt vào sát bên phải màn hình
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: MENU_WIDTH, // menu trượt ra ngoài bên phải màn hình
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
    // Thực hiện chuyển màn hình
    console.log("Chọn menu:", screen);
    closeMenu();
  };

  return (
    <View style={{ zIndex: 100 }}>
      {/* Header bar */}
      <View
        style={{
          height: 80,
          top: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon style={{
            borderRadius: 50,
            backgroundColor: "#007bff",
          }} name="dna" size={24} color="#fff" />
          <Text
            style={{
              color: "#007bff",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            ADN Huyết Thống
          </Text>
        </View>

        <TouchableOpacity onPress={toggleMenu}>
          <Icon
            name={menuVisible ? "close" : "menu"}
            size={30}
            color="#007bff"
          />
        </TouchableOpacity>
      </View>

      {/* Menu trượt ra từ bên phải */}
      {menuVisible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 80,
            right: 0,
            width: MENU_WIDTH,
            height: SCREEN_HEIGHT - 60,
            backgroundColor: "#fff",
            paddingVertical: 20,
            paddingHorizontal: 16,
            transform: [{ translateX: slideAnim }],
            zIndex: 999,
            shadowColor: "#000",
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => onSelectMenu(item.screen)}
              style={{
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            >
              <Text style={{ fontSize: 18, color: "#333" }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

export default Header;
