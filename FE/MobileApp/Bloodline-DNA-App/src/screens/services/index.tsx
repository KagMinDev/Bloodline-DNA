import { Footer } from "@/components";
import React from "react";
import { ScrollView, View } from "react-native";
import { ServicesSection } from "./screen/services";
import styles from "./styles";
import AllServiceScreen from "./screen/AllServiceScreen";

const Services: React.FC = () => {
  return (
    <View style={styles.container}>

      {/* Main content with improved spacing */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Services section with spacing */}
        <View style={styles.section}>
          <AllServiceScreen />
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