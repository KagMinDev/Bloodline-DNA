import React, { useEffect } from "react";
import { Modal, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Line, Path } from "react-native-svg";
import styles from "./styles";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  message?: string;
  fullScreen?: boolean;
  color?: "blue" | "green" | "white";
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  message = "Đang tải...",
  fullScreen = false,
  color = "blue",
}) => {
  // Cấu hình kích thước
  const sizeConfig = {
    small: { container: { width: 32, height: 32 }, text: { fontSize: 12 } },
    medium: { container: { width: 64, height: 64 }, text: { fontSize: 16 } },
    large: { container: { width: 96, height: 96 }, text: { fontSize: 18 } },
  };

  // Cấu hình màu sắc
  const colorConfig = {
    blue: "#2563EB",
    green: "#16A34A",
    white: "#FFFFFF",
  };

  // Giá trị animation
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const fade = useSharedValue(0.4);

  // Thiết lập animation
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withTiming(
        1.1,
        { duration: 2000, easing: Easing.inOut(Easing.ease) },
        (finished) => {
          if (finished) pulse.value = 1;
        }
      ),
      -1,
      true
    );
    fade.value = withRepeat(
      withTiming(
        1,
        { duration: 1500, easing: Easing.inOut(Easing.ease) },
        (finished) => {
          if (finished) fade.value = 0.4;
        }
      ),
      -1,
      true
    );
  }, [rotation, pulse, fade]);

  // Animated styles với mảng phụ thuộc
  const animatedStrand1Style = useAnimatedStyle(
    () => ({
      transform: [{ rotateY: `${rotation.value}deg` }],
    }),
    [rotation]
  );
  const animatedStrand2Style = useAnimatedStyle(
    () => ({
      transform: [{ rotateY: `${-rotation.value}deg` }],
    }),
    [rotation]
  );
  const animatedGlowStyle = useAnimatedStyle(
    () => ({
      opacity: pulse.value,
      transform: [{ scale: pulse.value }],
    }),
    [pulse]
  );
  const animatedConnectingStyle = useAnimatedStyle(
    () => ({
      opacity: fade.value,
    }),
    [fade]
  );

  const DNAIcon = () => (
    <View style={[styles.iconContainer, sizeConfig[size].container]}>
      <Svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
        <Animated.View style={animatedGlowStyle}>
          {/* Chuỗi ADN bên trái */}
          <Animated.View style={animatedStrand1Style}>
            <G>
              <Path
                d="M8 2c0 4-2 6-2 10s2 6 2 10"
                stroke={colorConfig[color]}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <Circle cx="8" cy="4" r="1.5" fill={colorConfig[color]} />
              <Circle cx="6" cy="8" r="1.5" fill={colorConfig[color]} />
              <Circle cx="8" cy="12" r="1.5" fill={colorConfig[color]} />
              <Circle cx="6" cy="16" r="1.5" fill={colorConfig[color]} />
              <Circle cx="8" cy="20" r="1.5" fill={colorConfig[color]} />
            </G>
          </Animated.View>

          {/* Chuỗi ADN bên phải */}
          <Animated.View style={animatedStrand2Style}>
            <G>
              <Path
                d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                stroke={colorConfig[color]}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <Circle cx="16" cy="4" r="1.5" fill={colorConfig[color]} />
              <Circle cx="18" cy="8" r="1.5" fill={colorConfig[color]} />
              <Circle cx="16" cy="12" r="1.5" fill={colorConfig[color]} />
              <Circle cx="18" cy="16" r="1.5" fill={colorConfig[color]} />
              <Circle cx="16" cy="20" r="1.5" fill={colorConfig[color]} />
            </G>
          </Animated.View>

          {/* Đường nối */}
          <Animated.View style={animatedConnectingStyle}>
            <G>
              <Line
                x1="8"
                y1="4"
                x2="16"
                y2="4"
                stroke={colorConfig[color]}
                strokeWidth={1}
              />
              <Line
                x1="6"
                y1="8"
                x2="18"
                y2="8"
                stroke={colorConfig[color]}
                strokeWidth={1}
              />
              <Line
                x1="8"
                y1="12"
                x2="16"
                y2="12"
                stroke={colorConfig[color]}
                strokeWidth={1}
              />
              <Line
                x1="6"
                y1="16"
                x2="18"
                y2="16"
                stroke={colorConfig[color]}
                strokeWidth={1}
              />
              <Line
                x1="8"
                y1="20"
                x2="16"
                y2="20"
                stroke={colorConfig[color]}
                strokeWidth={1}
              />
            </G>
          </Animated.View>
        </Animated.View>
      </Svg>
    </View>
  );

  // Lớp phủ loading toàn màn hình với nền mờ
  if (fullScreen) {
    return (
      <Modal transparent={true} animationType="fade" visible={true}>
        <View style={styles.fullScreen}>
          <View style={styles.backdrop} />
          <View style={styles.content}>
            <DNAIcon />
            {message && (
              <Text
                style={[
                  styles.text,
                  sizeConfig[size].text,
                  { color: colorConfig[color], marginTop: 10 },
                ]}
              >
                {message}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  // Component loading nội tuyến
  return (
    <View style={styles.inline}>
      <DNAIcon />
      {message && (
        <Text
          style={[
            styles.text,
            sizeConfig[size].text,
            { color: colorConfig[color], marginTop: 10 },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

// Các component Loading bổ sung
export const PageLoading: React.FC<{ message?: string }> = ({
  message = "Đang tải trang...",
}) => <Loading size="large" message={message} fullScreen={true} color="blue" />;

export const ButtonLoading: React.FC<{ message?: string }> = ({
  message = "Đang xử lý...",
}) => (
  <View style={styles.button}>
    <Loading size="small" message="" color="white" />
    {message && <Text style={styles.buttonText}>{message}</Text>}
  </View>
);

export const CardLoading: React.FC<{ message?: string }> = ({
  message = "Đang tải dữ liệu...",
}) => (
  <View style={styles.card}>
    <Loading size="medium" message={message} color="blue" />
  </View>
);

export const MedicalLoading: React.FC<{ message?: string }> = ({
  message = "Đang xử lý dữ liệu y tế...",
}) => (
  <View style={styles.medical}>
    <Loading size="large" message={message} color="green" />
    <Text style={styles.medicalText}>
      Hệ thống đang bảo mật xử lý thông tin của bạn
    </Text>
  </View>
);

export const LoadingWithDots: React.FC<{ message?: string }> = ({
  message = "Đang tải",
}) => {
  const [dots, setDots] = React.useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.inline}>
      <Loading size="medium" message="" color="blue" />
      <Text style={styles.dotsText}>
        {message}
        {dots}
      </Text>
    </View>
  );
};

export default Loading;