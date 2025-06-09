import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Svg, { Circle, G, Line, Path } from "react-native-svg";
import { RootStackParamList } from "../../../../types/root-stack/stack.types";
import styles from "./styles";

const { width } = Dimensions.get("window");

const HeroSection: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Kết nối gia đình qua{"\n"}
            <Text style={styles.titleHighlight}>Xét nghiệm ADN</Text>
          </Text>
          <Text style={styles.description}>
            Xác định quan hệ huyết thống với độ chính xác 99.99%. Kết quả nhanh,
            bảo mật tuyệt đối, hỗ trợ tận tình.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Đặt lịch xét nghiệm</Text>
          </TouchableOpacity>
        </View>

        {/* Image Section (DNA Icon) */}
        <View style={styles.imageContainer}>
          <View style={styles.dnaWrapper}>
            <Svg
              width={width > 768 ? 192 : 144} // w-48 md:w-48
              height={width > 768 ? 192 : 144} // h-48 md:h-48
              viewBox="0 0 24 24"
              fill="none"
            >
              <G>
                <Path
                  d="M8 2c0 4-2 6-2 10s2 6 2 10"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <Circle cx="8" cy="4" r="1.5" fill="#2563EB" />
                <Circle cx="6" cy="8" r="1.5" fill="#2563EB" />
                <Circle cx="8" cy="12" r="1.5" fill="#2563EB" />
                <Circle cx="6" cy="16" r="1.5" fill="#2563EB" />
                <Circle cx="8" cy="20" r="1.5" fill="#2563EB" />
                <Path
                  d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <Circle cx="16" cy="4" r="1.5" fill="#2563EB" />
                <Circle cx="18" cy="8" r="1.5" fill="#2563EB" />
                <Circle cx="16" cy="12" r="1.5" fill="#2563EB" />
                <Circle cx="18" cy="16" r="1.5" fill="#2563EB" />
                <Circle cx="16" cy="20" r="1.5" fill="#2563EB" />
                <Line
                  x1="8"
                  y1="4"
                  x2="16"
                  y2="4"
                  stroke="#2563EB"
                  strokeWidth={1}
                  opacity={0.8}
                />
                <Line
                  x1="6"
                  y1="8"
                  x2="18"
                  y2="8"
                  stroke="#2563EB"
                  strokeWidth={1}
                  opacity={0.8}
                />
                <Line
                  x1="8"
                  y1="12"
                  x2="16"
                  y2="12"
                  stroke="#2563EB"
                  strokeWidth={1}
                  opacity={0.8}
                />
                <Line
                  x1="6"
                  y1="16"
                  x2="18"
                  y2="16"
                  stroke="#2563EB"
                  strokeWidth={1}
                  opacity={0.8}
                />
                <Line
                  x1="8"
                  y1="20"
                  x2="16"
                  y2="20"
                  stroke="#2563EB"
                  strokeWidth={1}
                  opacity={0.8}
                />
              </G>
            </Svg>
          </View>
          {/* Decorative Circles */}
          <View style={[styles.decorCircle1, { top: 0, left: 0 }]} />
          <View style={[styles.decorCircle2, { bottom: 0, right: 0 }]} />
          <View style={[styles.decorCircle3, { top: "33%", right: "33%" }]} />
        </View>
      </View>
    </View>
  );
};

export default HeroSection;