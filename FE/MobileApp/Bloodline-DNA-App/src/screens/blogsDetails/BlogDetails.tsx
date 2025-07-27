import { RootStackParamList } from "@/types/root-stack/stack.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Facebook,
  FileText,
  Link as LinkIcon,
  Twitter
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getBlogById, getBlogsApi } from "../blogs/api/blogApi";
import { BlogPost } from "../blogs/types/blogs.types";
import { styles } from "./styles";

type BlogDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'BlogDetailsScreen'>;
type BlogDetailsRouteProp = RouteProp<RootStackParamList, 'BlogDetailsScreen'>;

interface RouteParams {
  id: string;
}

const BlogDetailsScreen: React.FC = () => {
  const route = useRoute<BlogDetailsRouteProp>();
  const navigation = useNavigation<BlogDetailsNavigationProp>();
  const { id } = route.params;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);

        if (id) {
          const currentBlog = await getBlogById(id);
          setBlog(currentBlog);

          const allBlogs = await getBlogsApi();
          const publishedBlogs = allBlogs
            .filter((post) => post.status === "Published" && post.id !== id)
            .map((post) => ({
              ...post,
              status: post.status as "Published" | "Draft",
            }));

          const related = publishedBlogs.slice(0, 5);
          setRelatedBlogs(related);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndRelated();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải bài viết...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setError(null);
            setLoading(true);
            setBlog(null);
            setRelatedBlogs([]);
          }}
          style={styles.retryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.errorIconWrapper}>
          <AlertCircle size={48} color="#dc2626" />
        </View>
        <Text style={styles.errorTitle}>Không tìm thấy bài viết</Text>
        <Text style={styles.errorSubtitle}>
          Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </Text>
      </View>
    );
  }

  const onBack = () => {
    navigation.goBack();
  };

  const sharePost = (platform: "twitter" | "facebook" | "copy") => {
    // Bạn có thể dùng react-native-share hoặc Clipboard API để thực hiện chia sẻ
    Alert.alert("Chia sẻ", `Chia sẻ lên ${platform} (chưa triển khai)`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <ArrowLeft size={20} color="#374151" />
          <Text style={styles.backButtonText}>Quay lại trang bài viết</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroWrapper}>
        <Image source={{ uri: blog.thumbnailURL }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{blog.title}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.authorWrapper}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorAvatarText}>
                  {blog.authorName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.authorName}>{blog.authorName}</Text>
            </View>
            <View style={styles.dateWrapper}>
              <Calendar size={16} color="white" />
              <Text style={styles.dateText}>
                {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentWrapper}>
        {/* Author Info Bar */}
        <View style={styles.authorBar}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatarLarge}>
              <Text style={styles.authorAvatarTextLarge}>
                {blog.authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.authorNameLarge}>{blog.authorName}</Text>
              <Text style={styles.authorRole}>Tác giả</Text>
            </View>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Ngày đăng</Text>
            <Text style={styles.dateTextGray}>
              {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* Article Content */}
        <Text style={styles.articleContent}>{blog.content}</Text>

        {/* Social Share */}
        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Chia sẻ bài viết</Text>
          <View style={styles.shareButtonsRow}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: "#2563eb" }]}
              activeOpacity={0.7}
              onPress={() => sharePost("twitter")}
            >
              <Twitter size={20} color="white" />
              <Text style={styles.shareButtonText}>Twitter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: "#1e40af" }]}
              activeOpacity={0.7}
              onPress={() => sharePost("facebook")}
            >
              <Facebook size={20} color="white" />
              <Text style={styles.shareButtonText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: "#4b5563" }]}
              activeOpacity={0.7}
              onPress={() => sharePost("copy")}
            >
              <LinkIcon size={20} color="white" />
              <Text style={styles.shareButtonText}>Sao chép link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Related Articles */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Bài viết đề xuất</Text>
          {relatedBlogs.length > 0 ? (
            relatedBlogs.map((related) => (
              <TouchableOpacity
                key={related.id}
                style={styles.relatedCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("BlogDetailsScreen", { id: related.id })}
              >
                <Image
                  source={{ uri: related.thumbnailURL }}
                  style={styles.relatedImage}
                />
                <View style={styles.relatedContent}>
                  <Text style={styles.relatedTitleText} numberOfLines={2}>
                    {related.title}
                  </Text>
                  <Text style={styles.relatedExcerpt} numberOfLines={3}>
                    {related.content?.substring(0, 120)}...
                  </Text>
                  <View style={styles.relatedMeta}>
                    <View style={styles.relatedAuthorWrapper}>
                      <View style={styles.relatedAuthorAvatar}>
                        <Text style={styles.relatedAuthorAvatarText}>
                          {related.authorName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.relatedAuthorName}>{related.authorName}</Text>
                    </View>
                    <Text style={styles.relatedDate}>
                      {new Date(related.createdAt).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noRelated}>
              <FileText size={48} color="#9ca3af" />
              <Text style={styles.noRelatedTitle}>Chưa có bài viết đề xuất</Text>
              <Text style={styles.noRelatedSubtitle}>
                Hiện tại chưa có bài viết liên quan để hiển thị.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default BlogDetailsScreen;