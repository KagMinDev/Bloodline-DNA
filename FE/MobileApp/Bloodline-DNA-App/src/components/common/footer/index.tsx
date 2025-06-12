import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import type { RootStackParamList } from "../../../types/root-stack/stack.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const Footer: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const quickLinks = [
    { title: "Đăng nhập", screen: "Login" },
    { title: "Đăng ký", screen: "Register" },
    { title: "Quên mật khẩu", screen: "ForgotPassword" },
    { title: "Liên hệ hỗ trợ", screen: "Contact" },
  ];

  const contactInfo = [
    { icon: "email", text: "bloodlineDNA@support.com" },
    { icon: "phone", text: "+84 342 555 702" },
    { icon: "map-marker", text: "TP Ho Chi Minh, Vietnam" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.gridContainer,
            { flexDirection: width >= 768 ? "row" : "column" },
          ]}
        >
          {/* Logo & About */}
          <View style={styles.section}>
            <Text style={styles.logo}>ADN Huyết Thống</Text>
            <Text style={styles.aboutText}>
              Nền tảng xét nghiệm ADN huyết thống chuyên nghiệp, bảo mật và
              nhanh chóng – đồng hành cùng bạn trong hành trình xác định quan hệ
              gia đình.
            </Text>
          </View>

          {/* Quick Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Liên kết nhanh</Text>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.linkItem}
                onPress={() => navigation.navigate({ name: link.screen as any, params: undefined })}
              >
                <Text style={styles.linkText}>{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Liên hệ</Text>
            {contactInfo.map((info, index) => (
              <View key={index} style={styles.contactItem}>
                <Icon
                  name={info.icon}
                  size={16}
                  color="#3B82F6"
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{info.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} ADN Huyết Thống.
          </Text>
          <View style={styles.bottomLinks}>
            <Text style={styles.bottomLink}>Bảo mật</Text>
            <Text style={styles.bottomSeparator}>–</Text>
            <Text style={styles.bottomLink}>Chính xác</Text>
            <Text style={styles.bottomSeparator}>–</Text>
            <Text style={styles.bottomLink}>Chuyên nghiệp</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Footer;