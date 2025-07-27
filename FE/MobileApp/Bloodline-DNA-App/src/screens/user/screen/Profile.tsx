import { useAuth } from "@/context/auth/AuthContext";
import { getUserInfoApi } from "@/screens/auth/apis/loginApi";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const navItems = [
  { label: "Trang chủ", screen: "Main" },
  { label: "Về chúng tôi", screen: "About" },
  { label: "Lịch sử đặt lịch", screen: "BookingHistory" },
  { label: "Các Bác Sĩ", screen: "Doctors" },
  { label: "Tin tức", screen: "News" },
  { label: "Liên hệ", screen: "Contact" },
];

const getIconName = (screen: string) => {
  switch (screen) {
    case "Home":
      return "home-outline";
    case "About":
      return "information-outline";
    case "BookingHistory":
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

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { token, logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const user = await getUserInfoApi(token);
        setUserName(user?.username || "Bạn ơi đăng nhập lại nhé");
      } catch (err) {
        console.warn("Không thể lấy thông tin người dùng:", err);
        setUserName("Không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const onSelectMenu = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Icon name="account-circle" size={70} color="#007bff" />
        {loading ? (
          <ActivityIndicator color="#007bff" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.username}>
            {userName || "Xin chào!"}
          </Text>
        )}
      </View>

      <View style={styles.menu}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => onSelectMenu(item.screen)}
            style={styles.menuItem}
          >
            <Icon
              name={getIconName(item.screen)}
              size={20}
              color="#007bff"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
        <AntDesign name="logout" size={14} color="#ff4d4d" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  menu: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#ff4d4d",
    fontSize: 16,
    marginRight: 6,
  },
});
