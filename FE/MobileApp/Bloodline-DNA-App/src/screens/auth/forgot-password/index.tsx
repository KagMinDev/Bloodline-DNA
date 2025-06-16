import { ForgotPassword } from '@/types/auth/auth.types';
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
import { RootStackParamList } from '../../../types/root-stack/stack.types';
import styles from './styles';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
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

  const validateEmail = () => {
    if (!email) {
      setEmailError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email không hợp lệ');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail()) {
      return;
    }

    const data: ForgotPassword = { Email: email };
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmail('');
      Alert.alert('Thành công', 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn');
      // @ts-ignore
      navigation.navigate('Login');
    } catch (error) {
      console.error('Gửi yêu cầu thất bại:', error);
      setEmailError('Gửi yêu cầu thất bại, vui lòng kiểm tra lại');
      Alert.alert('Lỗi', 'Gửi yêu cầu thất bại, vui lòng kiểm tra lại');
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
                      outputRange: ['0deg', '360deg'],
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

        <Text style={styles.title}>Khôi Phục Tài Khoản</Text>
        <Text style={styles.subtitle}>Lấy lại quyền truy cập hệ thống y tế của bạn</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="shield" size={20} color="#BFDBFE" />
            <Text style={styles.featureText}>Bảo mật thông tin tuyệt đối</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="heart" size={20} color="#BFDBFE" />
            <Text style={styles.featureText}>Hỗ trợ khôi phục nhanh chóng</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="account-group" size={20} color="#BFDBFE" />
            <Text style={styles.featureText}>Đội ngũ hỗ trợ 24/7</Text>
          </View>
        </View>

        <View style={[styles.decorCircle, { top: 40, left: 20 }]} />
        <View style={[styles.decorCircle, { bottom: 80, right: 30, backgroundColor: 'rgba(74, 222, 128, 0.2)' }]} />
        <View style={[styles.decorCircle, { top: 0.3 * require('react-native').Dimensions.get('window').height, right: 10, width: 32, height: 32 }]} />
      </View>

      {/* Right Side - Forgot Password Form */}
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <View style={styles.unlockIcon}>
            <Icon name="lock-open" size={24} color="#2563EB" />
          </View>
          <Text style={styles.formTitle}>Quên Mật Khẩu</Text>
          <Text style={styles.formSubtitle}>Nhập email để nhận hướng dẫn đặt lại mật khẩu</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Địa chỉ Email <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, emailError && styles.inputError]}>
              <Icon name="email" size={15} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Gửi Yêu Cầu</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Quay lại{'   '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Đăng nhập
            </Text>
          </Text>
          <Text style={styles.footerText}>
            Chưa có tài khoản?{'   '}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Đăng ký ngay
            </Text>
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Hỗ trợ 24/7</Text>
            <Text style={styles.footerLink}>•</Text>
            <Text style={styles.footerLink}>Bảo mật SSL</Text>
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Đang gửi yêu cầu đặt lại mật khẩu...</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default ForgotPasswordScreen;