import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { BlogPost } from "../../types/blogs.types";
import PostCard from "../post-card";

interface FeaturedPostsProps {
  filteredPosts: BlogPost[];
  formatDate: (dateString: string) => string;
}

export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  filteredPosts,
  formatDate,
}) => {
  const featuredPosts = filteredPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1);

  if (!featuredPosts.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Bài Viết Nổi Bật</Text>
      <FlatList
        data={featuredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} formatDate={formatDate} isFeatured={true} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb", // bg-gray-50
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a", // text-blue-900
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
});
