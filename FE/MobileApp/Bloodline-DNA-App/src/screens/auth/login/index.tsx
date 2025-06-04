import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Login } from "../../../types/auth/auth.types";
import { RootStackParamList } from "../../../types/root-stack/stack.types";
import styles from "./styles";

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // DNA animation
  const rotation = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async (data: Login) => {
    setLoading(true);
    try {
      console.log("Dữ liệu giả:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigation.navigate("Main");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      enableOnAndroid
    >
      {/* Left Side - Medical Illustration */}
      <View style={styles.leftContainer}>
        <View style={styles.dnaContainer}>
          <Animated.View
            style={[
              styles.dnaWrapper,
              {
                transform: [
                  {
                    rotateY: rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.dnaStrand}>
              <View style={styles.dnaDot} />
              <View style={styles.dnaDot} />
              <View style={styles.dnaDot} />
            </View>
            <View style={[styles.dnaStrand, styles.dnaStrandRight]}>
              <View style={styles.dnaDot} />
              <View style={styles.dnaDot} />
              <View style={styles.dnaDot} />
            </View>
            <View style={styles.dnaConnector} />
            <View style={[styles.dnaConnector, { top: 30 }]} />
            <View style={[styles.dnaConnector, { top: 60 }]} />
          </Animated.View>
          <View style={styles.heartIcon}>
            <Icon name="heart" size={16} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Hệ Thống Y Tế Thông Minh</Text>
        <Text style={styles.subtitle}>Dịch vụ xét nghiệm ADN huyết thống</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="shield" size={18} color="#BFDBFE" />
            <Text style={styles.featureText}>Bảo mật thông tin tuyệt đối</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="heart" size={18} color="#BFDBFE" />
            <Text style={styles.featureText}>Theo dõi sức khỏe 24/7</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="account-group" size={18} color="#BFDBFE" />
            <Text style={styles.featureText}>Đội ngũ bác sĩ chuyên nghiệp</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="chat" size={18} color="#BFDBFE" />
            <Text style={styles.featureText}>
              Hỏi đáp nhanh 24h cùng chatbotAI
            </Text>
          </View>
        </View>

        <View style={[styles.decorCircle, { top: 40, left: 20 }]} />
        <View
          style={[
            styles.decorCircle,
            {
              bottom: 80,
              right: 30,
              backgroundColor: "rgba(74, 222, 128, 0.2)",
            },
          ]}
        />
        <View
          style={[
            styles.decorCircle,
            {
              top:
                0.3 * require("react-native").Dimensions.get("window").height,
              right: 10,
              width: 32,
              height: 32,
            },
          ]}
        />
      </View>

      {/* Right Side - Login Form */}
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <View style={styles.lockIcon}>
            <Icon name="lock" size={24} color="#2563EB" />
          </View>
          <Text style={styles.formTitle}>Đăng Nhập</Text>
          <Text style={styles.formSubtitle}>
            Truy cập vào hệ thống quản lý y tế của bạn
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Địa chỉ Email</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="email"
                size={15}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật Khẩu</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={15}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={17}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formOptions}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity>
                <View style={styles.checkbox} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={() =>
              handleLogin({ Email: email, PasswordHash: password })
            }
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Đăng Nhập Hệ Thống</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Hỗ trợ 24/7</Text>
            <Text style={styles.footerLink}>•</Text>
            <Text style={styles.footerLink}>Bảo mật SSL</Text>
            <Text style={styles.footerLink}>•</Text>
            <Text style={styles.footerLink}>HIPAA Compliant</Text>
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>
            Đang xác thực thông tin đăng nhập...
          </Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
