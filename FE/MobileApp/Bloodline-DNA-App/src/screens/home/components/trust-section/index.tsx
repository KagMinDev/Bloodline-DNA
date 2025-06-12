import React from "react";
import { Dimensions, ImageBackground, Text, View } from "react-native";
import { TrustIndicator } from "../../../../types/home/home.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

// Bạn có thể tạo 1 hình gradient đơn giản hoặc dùng link online
const gradientImage = {
  uri: "https://png.pngtree.com/png-vector/20241017/ourlarge/pngtree-professional-doctor-isolated-on-transparent-background-png-image_14106014.png",
};

const indicators: TrustIndicator[] = [
  { value: "10K+", label: "Khách hàng" },
  { value: "50K+", label: "Xét nghiệm ADN" },
  { value: "100+", label: "Chuyên gia" },
];

const TrustSection: React.FC = () => {
  return (
    <ImageBackground
      source={gradientImage}
      style={styles.container}
      resizeMode="cover"
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
    </ImageBackground>
  );
};

export default TrustSection;
