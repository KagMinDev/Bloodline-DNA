import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Line, Path } from "react-native-svg";
import type { RootStackParamList } from "../../../types/root-stack/stack.types";
import Loading from "../loading";
import { styles } from "./styles";

// Tạo các thành phần SVG động
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const { width } = Dimensions.get("window");

const DNAIcon: React.FC = () => {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const pulse = useSharedValue(1);
  const fade = useSharedValue(0.4);

  // Hiệu ứng cho các sợi DNA
  React.useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
    );
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 3000, easing: Easing.linear }),
      -1,
    );
    pulse.value = withRepeat(
      withTiming(1.1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    fade.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedProps1 = useAnimatedProps(() => ({
    transform: [{ rotateY: `${rotation1.value}deg` }],
  }));

  const animatedProps2 = useAnimatedProps(() => ({
    transform: [{ rotateY: `${rotation2.value}deg` }],
  }));

  const animatedGlowProps = useAnimatedProps(() => ({
    opacity: pulse.value,
    transform: [{ scale: pulse.value }],
  }));

  const animatedFadeProps = useAnimatedProps(() => ({
    opacity: fade.value,
  }));

  const iconSize = width >= 768 ? 96 : 64;

  return (
    <View style={styles.dnaContainer}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
        <AnimatedG animatedProps={animatedGlowProps}>
          {/* Sợi DNA trái */}
          <AnimatedG animatedProps={animatedProps1}>
            <AnimatedPath
              d="M8 2c0 4-2 6-2 10s2 6 2 10"
              stroke="#2563EB"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <AnimatedCircle cx={8} cy={4} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={6} cy={8} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={8} cy={12} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={6} cy={16} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={8} cy={20} r={1.5} fill="#2563EB" />
          </AnimatedG>

          {/* Sợi DNA phải */}
          <AnimatedG animatedProps={animatedProps2}>
            <AnimatedPath
              d="M16 2c0 4 2 6 2 10s-2 6-2 10"
              stroke="#2563EB"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <AnimatedCircle cx={16} cy={4} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={18} cy={8} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={16} cy={12} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={18} cy={16} r={1.5} fill="#2563EB" />
            <AnimatedCircle cx={16} cy={20} r={1.5} fill="#2563EB" />
          </AnimatedG>

          {/* Đường nối */}
          <AnimatedG animatedProps={animatedFadeProps}>
            <AnimatedLine x1={8} y1={4} x2={16} y2={4} stroke="#2563EB" strokeWidth={1} />
            <AnimatedLine x1={6} y1={8} x2={18} y2={8} stroke="#2563EB" strokeWidth={1} />
            <AnimatedLine x1={8} y1={12} x2={16} y2={12} stroke="#2563EB" strokeWidth={1} />
            <AnimatedLine x1={6} y1={16} x2={18} y2={16} stroke="#2563EB" strokeWidth={1} />
            <AnimatedLine x1={8} y1={20} x2={16} y2={20} stroke="#2563EB" strokeWidth={1} />
          </AnimatedG>
        </AnimatedG>
      </Svg>
    </View>
  );
};

const NotFound: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleBackToHome = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate("Home");
      setLoading(false);
    }, 1000);
  };

  return (
    <LinearGradient
      colors={["#EFF6FF", "#DBEAFE"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <DNAIcon />
        </View>
        <Text style={[styles.errorCode, { opacity: loading ? 0.7 : 1 }]}>
          404
        </Text>
        <Text style={styles.title}>Trang không tìm thấy</Text>
        <Text style={styles.description}>
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Hãy quay lại trang chủ để tiếp tục khám phá.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleBackToHome}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Quay lại Trang chủ</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <Loading
          fullScreen={true}
          message="Đang quay về trang chủ..."
          size="large"
          color="blue"
        />
      )}
    </LinearGradient>
  );
};

export default NotFound;