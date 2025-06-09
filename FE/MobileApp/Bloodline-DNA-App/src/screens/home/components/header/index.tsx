import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../../../../types/root-stack/stack.types";
import styles from "./styles";

const Header: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="dna" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>ADN Huyết Thống</Text>
        </View>

        {/* Navigation */}
        <View style={styles.navContainer}>
          {[
            { label: "Trang chủ", screen: "Home" },
            { label: "Về chúng tôi", screen: "About" },
            { label: "Dịch vụ", screen: "Services" },
            { label: "Các Bác Sĩ", screen: "Doctors" },
            { label: "Tin tức", screen: "News" },
            { label: "Liên hệ", screen: "Contact" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.navItem}
              onPress={() => navigation.navigate(item.screen as any)} // Giả định các màn hình đã được định nghĩa
            >
              <Text style={styles.navText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;