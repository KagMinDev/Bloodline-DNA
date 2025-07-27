import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface BlogHeroProps {
  isVisible: boolean;
}

const BlogHero: React.FC<BlogHeroProps> = ({ isVisible }) => {
  if (!isVisible) return null; // hoặc loading animation

  return (
    <View style={styles.container}>
      {/* Background SVG Wave */}
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <Path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af" opacity={0.1} />
      </Svg>

      <View style={styles.contentWrapper}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbLink} onPress={() => {/* navigate home */}}>
            Trang Chủ
          </Text>
          <Text style={styles.breadcrumbSeparator}> / </Text>
          <Text style={styles.breadcrumbCurrent}>Blog Y Tế</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Blog Y Tế
          <Text style={styles.subtitle}>{"\n"}Kiến Thức Sức Khỏe</Text>
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Khám phá những bài viết chuyên sâu về sức khỏe, y học và lối sống khỏe mạnh từ đội ngũ chuyên gia hàng đầu.
        </Text>
      </View>
    </View>
  );
};

export default BlogHero;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 40, // py-20 = 20*2
    backgroundColor: "#eff6ff", // bg-blue-50
    overflow: "hidden",
    position: "relative",
  },
  contentWrapper: {
    paddingHorizontal: 16,
    maxWidth: 1280, // max-w-7xl ~ 80rem = 1280px
    alignSelf: "center",
    zIndex: 10,
  },
  breadcrumb: {
    flexDirection: "row",
    marginBottom: 24,
  },
  breadcrumbLink: {
    color: "#2563eb", // text-blue-600
    fontWeight: "500",
  },
  breadcrumbSeparator: {
    marginHorizontal: 6,
    color: "#2563eb",
  },
  breadcrumbCurrent: {
    fontWeight: "700",
    color: "#1e3a8a", // text-blue-900
  },
  title: {
    fontSize: 36, // text-4xl = 36px approx
    fontWeight: "700",
    color: "#1e3a8a",
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 20, // text-2xl
    fontWeight: "500",
    color: "#2563eb", // text-blue-700
    marginTop: 8,
  },
  description: {
    maxWidth: 600, // max-w-2xl ~ 40rem = 640px (tùy màn)
    fontSize: 16, // text-base
    lineHeight: 24,
    color: "#374151", // text-gray-700
    marginTop: 8,
  },
});
