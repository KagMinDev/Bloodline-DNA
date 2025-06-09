import React from "react";
import { Dimensions, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { TrustIndicator } from "../../../../types/home/home.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const indicators: TrustIndicator[] = [
  { value: "10K+", label: "Khách hàng" },
  { value: "50K+", label: "Xét nghiệm ADN" },
  { value: "100+", label: "Chuyên gia" },
];

const TrustSection: React.FC = () => {
  return (
    <LinearGradient
      colors={["#2563EB", "#1E40AF"]} // from-blue-600 to-blue-800
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Được tin tưởng bởi</Text>
        <View
          style={[
            styles.indicatorsContainer,
            { flexDirection: width >= 768 ? "row" : "column" },
          ]}
        >
          {indicators.map((indicator, index) => (
            <View key={index} style={styles.indicator}>
              <Text style={styles.value}>{indicator.value}</Text>
              <Text style={styles.label}>{indicator.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

export default TrustSection;