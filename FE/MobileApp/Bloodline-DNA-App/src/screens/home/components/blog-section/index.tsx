import { BlogPost } from "@/types/home/home.types.js";
import { RootStackParamList } from "@/types/root-stack/stack.types.js";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const posts: BlogPost[] = [
  {
    id: "1",
    title: "Xét nghiệm ADN huyết thống là gì?",
    description:
      "Tìm hiểu cách xét nghiệm ADN giúp xác định quan hệ cha con, mẹ con, hoặc anh em với độ chính xác cao.",
    link: "#",
  },
  {
    id: "2",
    title: "Bảo mật trong xét nghiệm ADN",
    description:
      "Khám phá cách chúng tôi bảo vệ dữ liệu ADN của bạn với công nghệ mã hóa tiên tiến.",
    link: "#",
  },
  {
    id: "3",
    title: "Ứng dụng của xét nghiệm ADN",
    description:
      "Ngoài huyết thống, xét nghiệm ADN còn được sử dụng trong di truyền, y học, và pháp y.",
    link: "#",
  },
];

const BlogSection: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const numColumns = width > 1024 ? 3 : width > 768 ? 2 : 1;

  // Giải pháp 1: Sử dụng scrollEnabled={false} (nếu có ScrollView cha)
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tin tức & Kiến thức về ADN</Text>
        <FlatList
          scrollEnabled={false} /* Quan trọng: Tắt scroll khi có ScrollView cha */
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postCard}
              onPress={() => navigation.navigate("BlogDetail", { id: item.id })}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDescription}>{item.description}</Text>
              <Text style={styles.readMore}>Đọc thêm →</Text>
            </TouchableOpacity>
          )}
          key={numColumns.toString()}
          columnWrapperStyle={
            numColumns > 1 ? styles.columnWrapper : undefined
          }
        />
      </View>
    </View>
  );
}

export default BlogSection;