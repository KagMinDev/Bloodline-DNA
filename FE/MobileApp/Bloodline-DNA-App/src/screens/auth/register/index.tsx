import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Register } from '../../../types/auth/auth.types';
import { RootStackParamList } from '../../../types/root-stack/stack.types';
import styles from './styles';

const RegisterScreen: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // DNA animation
  const rotation = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {};
    let valid = true;

    // FullName validation (assuming fullNameRules requires non-empty and min length)
    if (!fullName) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
      valid = false;
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
      valid = false;
    }

    // Email validation (assuming emailRules requires valid email format)
    if (!email) {
      newErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
      valid = false;
    }

    // Phone validation (assuming phoneRules requires valid phone format)
    if (!phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      valid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
      valid = false;
    }

    // Address validation (assuming addressRules requires non-empty)
    if (!address) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
      valid = false;
    }

    // Password validation (assuming passwordRules requires min length and complexity)
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      valid = false;
    }

    // Terms validation
    if (!termsAccepted) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản dịch vụ';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const registerData: Register = {
      FullName: fullName,
      Email: email,
      Phone: phone,
      PasswordHash: password,
      Address: address,
      Role: 'customer',
    };

    setLoading(true);
    try {
      console.log('Dữ liệu giả:', registerData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // @ts-ignore
      navigation.navigate('Home');
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      setErrors((prev) => ({
        ...prev,
        email: 'Đăng ký thất bại, vui lòng kiểm tra lại',
      }));
      Alert.alert('Lỗi', 'Đăng ký thất bại, vui lòng kiểm tra lại');
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
                    scale: rotation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.05, 1],
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
          <View style={styles.activityIcon}>
            <Icon name="heart-pulse" size={16} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Tham Gia Cùng Chúng Tôi</Text>
        <Text style={styles.subtitle}>Hành trình kiểm tra toàn diện với dịch vụ ADN huyết thống</Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Icon name="clock" size={20} color="#D1FAE5" />
            <Text style={styles.benefitText}>Đặt lịch khám nhanh chóng</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="shield" size={20} color="#D1FAE5" />
            <Text style={styles.benefitText}>Lưu trữ hồ sơ y tế an toàn</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="heart" size={20} color="#D1FAE5" />
            <Text style={styles.benefitText}>Theo dõi sức khỏe liên tục</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="account-group" size={20} color="#D1FAE5" />
            <Text style={styles.benefitText}>Kết nối với bác sĩ chuyên khoa</Text>
          </View>
        </View>

        <View style={styles.trustContainer}>
          <Text style={styles.trustText}>Được tin tưởng bởi</Text>
          <View style={styles.trustStats}>
            <Text style={styles.trustNumber}>50K+</Text>
            <Text style={styles.trustLabel}>Bệnh nhân</Text>
            <Text style={styles.trustNumber}>200+</Text>
            <Text style={styles.trustLabel}>Bác sĩ</Text>
            <Text style={styles.trustNumber}>15+</Text>
            <Text style={styles.trustLabel}>Chuyên khoa</Text>
          </View>
        </View>

        <View style={[styles.decorCircle, { top: 40, left: 20 }]} />
        <View style={[styles.decorCircle, { bottom: 80, right: 30, backgroundColor: 'rgba(96, 165, 250, 0.2)' }]} />
        <View style={[styles.decorCircle, { top: 0.3 * require('react-native').Dimensions.get('window').height, right: 10, width: 32, height: 32 }]} />
        <View style={[styles.decorCircle, { bottom: 0.3 * require('react-native').Dimensions.get('window').height, left: 10, width: 40, height: 40, backgroundColor: 'rgba(52, 211, 153, 0.2)' }]} />
      </View>

      {/* Right Side - Registration Form */}
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <View style={styles.userPlusIcon}>
            <Icon name="account-plus" size={24} color="#059669" />
          </View>
          <Text style={styles.formTitle}>Đăng Ký Tài Khoản</Text>
          <Text style={styles.formSubtitle}>Tạo tài khoản để truy cập đầy đủ dịch vụ y tế</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Họ và tên <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
              <Icon name="account" size={15} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập tên đầy đủ. Ví dụ: Nguyễn Văn A"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrors((prev) => ({ ...prev, fullName: null }));
                }}
                editable={!loading}
              />
            </View>
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Icon name="email" size={15} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa chỉ email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.label}>
                Số điện thoại <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Icon name="phone" size={15} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Địa chỉ <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.address && styles.inputError]}>
              <Icon name="home" size={15} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ của bạn"
                placeholderTextColor="#9CA3AF"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  setErrors((prev) => ({ ...prev, address: null }));
                }}
                editable={!loading}
              />
            </View>
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.label}>
                Mật khẩu <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Icon name="lock" size={15} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu của bạn"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prev) => ({ ...prev, password: null }));
                    if (confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: text === confirmPassword ? null : 'Mật khẩu không khớp',
                      }));
                    }
                  }}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.label}>
                Xác nhận mật khẩu <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                <Icon name="lock" size={15} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu của bạn"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: text === password ? null : 'Mật khẩu không khớp',
                    }));
                  }}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Điều khoản <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setTermsAccepted(!termsAccepted)}
                disabled={loading}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Tôi đồng ý với{' '}
                <Text style={styles.linkText} onPress={() => {}}>
                  Điều khoản dịch vụ
                </Text>{' '}
                và{' '}
                <Text style={styles.linkText} onPress={() => {}}>
                  Chính sách bảo mật
                </Text>
              </Text>
            </View>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Tạo Tài Khoản</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Đã có tài khoản?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Đăng nhập ngay
            </Text>
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Miễn phí đăng ký</Text>
            <Text style={styles.footerLink}>•</Text>
            <Text style={styles.footerLink}>Bảo mật tuyệt đối</Text>
            <Text style={styles.footerLink}>•</Text>
            <Text style={styles.footerLink}>Hỗ trợ 24/7</Text>
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Đang tạo tài khoản...</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;