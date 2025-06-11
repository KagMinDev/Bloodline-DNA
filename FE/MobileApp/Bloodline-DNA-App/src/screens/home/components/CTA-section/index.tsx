import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { RootStackParamList } from "../../../../types/root-stack/stack.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const CTASection: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Sẵn sàng khám phá quan hệ huyết thống?
        </Text>
        <Text style={styles.description}>
          Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo mật.
          Hỗ trợ 24/7 từ đội ngũ chuyên gia.
        </Text>
        <View
          style={[
            styles.buttonContainer,
            { flexDirection: width >= 768 ? "row" : "column" },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.primaryButtonText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Contact")}
          >
            <Text style={styles.secondaryButtonText}>Liên hệ chúng tôi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CTASection;