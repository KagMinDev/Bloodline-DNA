import React from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Feature } from "../../../../types/home/home.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const features: Feature[] = [
  {
    icon: "shield-check",
    title: "Độ chính xác 99.99%",
    description: "Công nghệ phân tích ADN tiên tiến đảm bảo kết quả đáng tin cậy.",
  },
  {
    icon: "lock",
    title: "Bảo mật tuyệt đối",
    description: "Dữ liệu được mã hóa, tuân thủ tiêu chuẩn bảo mật quốc tế.",
  },
  {
    icon: "rocket",
    title: "Kết quả nhanh chóng",
    description: "Nhận kết quả trong 3-5 ngày làm việc, hỗ trợ giao tận nơi.",
  },
  {
    icon: "account-group",
    title: "Hỗ trợ chuyên gia",
    description: "Đội ngũ tư vấn 24/7, giải đáp mọi thắc mắc về xét nghiệm.",
  },
];

const FeaturesSection: React.FC = () => {
  // Tính số cột dựa trên chiều rộng màn hình
  const numColumns = width > 1024 ? 4 : width > 768 ? 2 : 1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Vì sao chọn dịch vụ xét nghiệm ADN của chúng tôi?
        </Text>
        <FlatList
          scrollEnabled={false}
          data={features}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <Icon
                name={item.icon}
                size={40}
                color="#2563EB"
                style={styles.icon}
              />
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          )}
          key={numColumns.toString()}
          columnWrapperStyle={
            numColumns > 1 ? styles.columnWrapper : undefined
          }
        />
      </View>
    </View>
  );
};

export default FeaturesSection;