import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorBoundary from "../../../components/common/error-boundary";
import { PageLoading } from "../../../components/common/loading";
import { useAuth } from "../../../context/auth/AuthContext"; // Import hàm login từ
import { Login } from "../../../types/auth/auth.types";
import { RootStackParamList } from "../../../types/root-stack/stack.types";
import { getUserInfoApi, loginApi } from "../apis/loginApi";
import styles from "./styles";

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  // DNA animation for the illustration
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

  const validateInputs = (): boolean => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập địa chỉ email");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Địa chỉ email không hợp lệ");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (data: Login) => {
  if (!validateInputs()) return;

  setLoading(true);
  try {
    const response = await loginApi(data.email, data.password);
    const { token, role, userName } = response;
    // console.log(response)

    await login(token, userName);

    const userInfo = await getUserInfoApi(token);

    if (role === "Client") {
      await AsyncStorage.setItem("clientId", userInfo.id);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } else if (role === "Staff") {
      await AsyncStorage.setItem("staffId", userInfo.id);
      navigation.reset({
        index: 0,
        routes: [{ name: "DeliveriesStaffTabs" }],
      });
    }
  } catch (error: any) {
    console.error("Đăng nhập thất bại:", error);
    setEmailError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {loading && (
        <ErrorBoundary>
          <PageLoading message="Đang xác thực thông tin đăng nhập..." />
        </ErrorBoundary>
      )}
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
          <Text style={styles.subtitle}>
            Dịch vụ xét nghiệm ADN huyết thống
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Icon name="shield" size={18} color="#BFDBFE" />
              <Text style={styles.featureText}>
                Bảo mật thông tin tuyệt đối
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="heart" size={18} color="#BFDBFE" />
              <Text style={styles.featureText}>Theo dõi sức khỏe 24/7</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="account-group" size={18} color="#BFDBFE" />
              <Text style={styles.featureText}>
                Đội ngũ bác sĩ chuyên nghiệp
              </Text>
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
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.required}>*</Text>
                <Text style={styles.label}>Địa chỉ Email</Text>
              </View>
              <View style={styles.inputWrapper}>
                <Icon
                  name="email"
                  size={15}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, emailError && styles.inputError]}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.required}>*</Text>
                <Text style={styles.label}>Mật Khẩu</Text>
              </View>
              <View style={styles.inputWrapper}>
                <Icon
                  name="lock"
                  size={15}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, passwordError && styles.inputError]}
                  placeholder="Nhập mật khẩu của bạn"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
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
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.formOptions}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && <Icon name="check" size={14} color="#fff" />}
                  </View>
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
              onPress={() => handleLogin({ email: email, password: password })}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>Đăng Nhập Hệ Thống</Text>
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
      </KeyboardAwareScrollView>
    </>
  );
};

export default LoginScreen;
