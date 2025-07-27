import { Footer, Loading } from "@/components";
import Header from "@/components/common/header-main";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";
// import Sidebar from "../components/sidebar";
import { getBlogsApi } from "./api/blogApi";
import BlogPostList from "./components/blogPost-list";
import { FeaturedPosts } from "./components/featured-posts";
import BlogHero from "./components/hero";
import BlogSearchFilter from "./components/search";
import { styles } from "./styles";
import { BlogPost } from "./types/blogs.types";

const BlogsScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const blogs = await getBlogsApi();
        const publishedBlogs = blogs
          .filter((post) => post.status === "Published")
          .map((post) => ({
            ...post,
            status: post.status as "Published" | "Draft",
          }));
        setFilteredPosts(publishedBlogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải bài viết");
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Lọc tìm kiếm dựa trên searchTerm
    if (!searchTerm) return; // nếu rỗng thì không lọc lại để tránh xóa hết
    const filtered = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Loading fullScreen size="large" message="Đang tải bài viết..." color="blue" />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text
          style={styles.retryText}
          onPress={() => {
            setLoading(true);
            setError(null);
            // Trigger fetch lại
            (async () => {
              try {
                const blogs = await getBlogsApi();
                const publishedBlogs = blogs
                  .filter((post) => post.status === "Published")
                  .map((post) => ({
                    ...post,
                    status: post.status as "Published" | "Draft",
                  }));
                setFilteredPosts(publishedBlogs);
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Không thể tải bài viết"
                );
                setFilteredPosts([]);
              } finally {
                setLoading(false);
              }
            })();
          }}
        >
          Thử lại
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.fixedHeader}>
        <Header />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BlogHero isVisible={isVisible} />

        <BlogSearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <FeaturedPosts filteredPosts={filteredPosts} formatDate={formatDate} />

        <View style={styles.mainContent}>
          <View style={styles.postList}>
            <BlogPostList
              filteredPosts={filteredPosts}
              formatDate={formatDate}
              setSearchTerm={setSearchTerm}
            />
          </View>
          {/* <View style={styles.sidebar}>
            <Sidebar blogPosts={filteredPosts} formatDate={formatDate} />
          </View> */}
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogsScreen;
