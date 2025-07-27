import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { RootStackParamList } from "../../../types/root-stack/stack.types";
import { getTestsApi } from "../api/TestServiceApi";
import CardService from "../components/AllServices/CardService";
import { TestResponse } from "../types/TestService";

type CollectionMethod = "SelfSample" | "AtFacility";

const tabLabels: Record<CollectionMethod, string> = {
  SelfSample: "Tự lấy mẫu",
  AtFacility: "Lấy mẫu tại cơ sở",
};

const AllServiceScreen: React.FC = () => {
  const [services, setServices] = useState<TestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<CollectionMethod>("SelfSample");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await getTestsApi(token || "");
        setServices(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.priceServices.some((price) =>
      selectedTab === "SelfSample"
        ? price.collectionMethod === 0
        : price.collectionMethod === 1
    )
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <Header /> */}
      </View>

      <Text style={styles.title}>Tất Cả Dịch Vụ</Text>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(Object.keys(tabLabels) as CollectionMethod[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tabLabels[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CardService
            data={item}
            onPress={() =>
              navigation.navigate("DetailsService", { id: item.id })
            }
          />
        )}
      />
    </View>
  );
};

export default AllServiceScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginTop: 25,
    fontWeight: "bold",
    paddingHorizontal: 16,
    color: "#1e3a8a",
    textAlign: "center",
    paddingBottom: 25,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginHorizontal: 6,
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 14,
    color: "#374151",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#6b7280",
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
