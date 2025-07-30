import Header from "@/components/common/header-main";
import React from "react";
import { StyleSheet, View } from "react-native";
import AllServiceScreen from "./screen/AllServiceScreen";

const Services: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <AllServiceScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {},
});

export default Services;
