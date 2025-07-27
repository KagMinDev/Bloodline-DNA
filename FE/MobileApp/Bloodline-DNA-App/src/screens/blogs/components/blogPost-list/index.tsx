import { BookmarkIcon } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BlogPost } from "../../types/blogs.types";
import PostCard from "../post-card";

interface BlogPostListProps {
  filteredPosts: BlogPost[];
  formatDate: (dateString: string) => string;
  setSearchTerm: (term: string) => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  filteredPosts,
  formatDate,
  setSearchTerm,
}) => {
  if (filteredPosts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <BookmarkIcon size={64} color="#9ca3af" style={styles.icon} />
        <Text style={styles.emptyTitle}>Không tìm thấy bài viết</Text>
        <Text style={styles.emptySubtitle}>Vui lòng thử lại với từ khóa khác</Text>
        <TouchableOpacity
          onPress={() => setSearchTerm("")}
          style={styles.resetButton}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>Đặt Lại Bộ Lọc</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.countWrapper}>
        <Text style={styles.countText}>
          Tìm thấy{" "}
          <Text style={styles.countNumber}>{filteredPosts.length}</Text> bài viết
        </Text>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} formatDate={formatDate} isFeatured={false} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BlogPostList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countWrapper: {
    marginBottom: 16,
  },
  countText: {
    marginTop: 18,
    fontSize: 16,
    color: "#475569", // slate-600
  },
  countNumber: {
    fontWeight: "700",
    color: "#1e3a8a", // blue-900
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: "center",
  },
  icon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748b", // slate-500
    marginBottom: 24,
    textAlign: "center",
    maxWidth: 280,
  },
  resetButton: {
    backgroundColor: "#1e40af", // blue-900
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
