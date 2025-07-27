import { RootStackParamList } from "@/types/root-stack/stack.types";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarIcon, Share2 } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlogPost } from "../../types/blogs.types";

interface PostCardProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
  isFeatured: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, formatDate, isFeatured }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleReadMore = () => {
    navigation.navigate("BlogDetailsScreen", { id: post.id });
  };

  return (
    <View
      style={[
        styles.card,
        isFeatured ? styles.cardFeatured : styles.cardNormal,
      ]}
    >
      <View
        style={[
          isFeatured ? styles.imageContainerFeatured : styles.imageContainer,
        ]}
      >
        <Image
          source={{ uri: post.thumbnailURL }}
          style={[
            isFeatured ? styles.imageFeatured : styles.image,
          ]}
          resizeMode="cover"
        />
      </View>

      <View
        style={[
          isFeatured ? styles.contentFeatured : styles.contentNormal,
        ]}
      >
        <View>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              isFeatured ? styles.titleFeatured : styles.titleNormal,
            ]}
          >
            {post.title}
          </Text>
          <Text numberOfLines={3} style={styles.content}>
            {post.content}
          </Text>
        </View>

        <View style={styles.authorWrapper}>
          <Text
            style={[
              styles.author,
              isFeatured ? styles.authorFeatured : styles.authorNormal,
            ]}
          >
            {post.authorName}
          </Text>
        </View>

        <View style={styles.dateWrapper}>
          <CalendarIcon size={16} color="#475569" style={{ marginRight: 4 }} />
          <Text style={styles.dateText}>{formatDate(post.createdAt)}</Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.readMoreButton]}
            onPress={handleReadMore}
            activeOpacity={0.8}
          >
            <Text style={styles.readMoreText}>Đọc Thêm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            activeOpacity={0.8}
            onPress={() => {
              // Bạn có thể thêm chức năng chia sẻ ở đây
              console.log("Share button pressed");
            }}
          >
            <Share2 size={16} color="#1e40af" style={{ marginRight: 4 }} />
            <Text style={styles.shareText}>Chia Sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    overflow: "hidden",
    marginBottom: 24,
  },
  cardNormal: {
    borderWidth: 2,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 20,
    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow Android
    elevation: 2,
  },
  cardFeatured: {
    borderWidth: 0,
  },
  imageContainer: {
    height: 192, // 48*4 (48px = 12 rem, approximate)
    width: 256, // md:w-64 (256px)
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  imageContainerFeatured: {
    height: 256, // h-64
    width: "100%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFeatured: {
    width: "100%",
    height: "100%",
  },
  contentNormal: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  contentFeatured: {
    padding: 24,
  },
  title: {
    color: "#1e3a8a", // blue-900
    fontWeight: "bold",
  },
  titleNormal: {
    fontSize: 18, // text-lg/md:text-xl
  },
  titleFeatured: {
    fontSize: 24, // text-xl
  },
  content: {
    fontSize: 14,
    color: "#475569", // slate-600
    marginTop: 8,
  },
  authorWrapper: {
    marginTop: 16,
  },
  author: {
    color: "#1e3a8a",
  },
  authorNormal: {
    fontWeight: "700",
    fontSize: 12,
  },
  authorFeatured: {
    fontWeight: "600",
    fontSize: 14,
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  dateText: {
    color: "#64748b", // slate-500
    fontSize: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  readMoreButton: {
    backgroundColor: "#1e3a8a", // blue-900
  },
  readMoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  shareButton: {
    borderWidth: 1,
    borderColor: "#1e3a8a", // blue-900
  },
  shareText: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "600",
  },
});
