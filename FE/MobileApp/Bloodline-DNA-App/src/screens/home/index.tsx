import React from "react";
import { ScrollView, View } from "react-native";
import Footer from "../../components/common/footer";
import ChatbotAI from "../chatbotAI";
import BlogSection from "./components/blog-section";
import CTASection from "./components/CTA-section";
import FAQSection from "./components/FAQ-section";
import FeaturesSection from "./components/features-section";
import Header from "./components/header";
import HeroSection from "./components/hero-section";
import ProcessSection from "./components/process-section";
import TeamSection from "./components/team-section";
import TestimonialsSection from "./components/testimonials-section";
import TrustSection from "./components/trust-section";
import styles from "./styles";

const HomePageScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <Header />

      {/* Nội dung cuộn, thêm paddingTop để tránh che header */}
      <ScrollView
        contentContainerStyle={[styles.contentContainer]} // 80 là chiều cao header
        horizontal={false}
        alwaysBounceVertical={true}
      >
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <TeamSection />
        <FAQSection />
        <BlogSection />
        <TrustSection />
        <CTASection />
        <Footer />
      </ScrollView>

      <View style={styles.chatbotContainer}>
        <ChatbotAI />
      </View>
    </View>
  );
};

export default HomePageScreen;
