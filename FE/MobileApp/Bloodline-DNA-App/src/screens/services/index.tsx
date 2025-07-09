import { Footer } from "@/components";
import Header from "@/components/common/header-main";
import React from "react";
import { ScrollView, View } from "react-native";
import { ServicesSection } from "./screen/services";
import styles from "./styles";
import { ContactSection } from "./components/section/contact";

const Services: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header with proper spacing */}
      <View style={styles.header}>
        <Header />
      </View>

      {/* Main content with improved spacing */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Services section with spacing */}
        <View style={styles.section}>
          <ServicesSection />
        </View>

        {/* Contact section with spacing */}
        <View style={[styles.section, styles.contactSection]}>
          <ContactSection />
        </View>

        {/* Footer with proper spacing */}
        <View style={styles.footer}>
          <Footer />
        </View>
      </ScrollView>

    </View>
  );
};

export default Services;