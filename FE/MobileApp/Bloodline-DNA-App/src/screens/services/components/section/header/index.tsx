import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";

export const ServicesHeaderSection: React.FC = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(-10))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const spinAnim = useState(new Animated.Value(0))[0];
  const floatAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -20,
              duration: 3000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 3000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const { height } = Dimensions.get("window");
  const headerHeight = height * 0.65;

  return (
    <View style={[styles.container, { height: headerHeight }]}>
      {/* Nền trắng xám */}
      <View style={styles.background}>
        {/* Các phần tử trang trí */}
        <View style={styles.decorativeElements}>
          <Animated.View
            style={[
              styles.largeCircle,
              {
                transform: [
                  { translateY: Animated.multiply(scrollY, -0.3) },
                  { scale: pulseAnim },
                  { translateY: floatAnim },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.smallCircle,
              {
                transform: [
                  { translateY: Animated.multiply(scrollY, -0.2) },
                  { rotate: spin },
                  { translateY: floatAnim },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.mediumCircle,
              {
                transform: [
                  { translateY: Animated.multiply(scrollY, -0.4) },
                  { translateY: floatAnim },
                ],
              },
            ]}
          />
        </View>

        {/* Nội dung chính */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.titleText}>Dịch Vụ Y Tế</Text>
            <View style={styles.titleIndicator} />
          </Animated.View>

          <Animated.Text
            style={[
              styles.subtitleText,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            Khám phá các dịch vụ chăm sóc sức khỏe chuyên nghiệp toàn diện
          </Animated.Text>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Khám Phá Dịch Vụ</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};
