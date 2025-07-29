import { useAuth } from "@/context/auth/AuthContext";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getTestsApi } from "../../api/TestServiceApi";
import { TestResponse } from "../../types/TestService";

type CollectionMethod = "SelfSample" | "AtFacility";

const tabLabels = {
  SelfSample: "Tự lấy mẫu",
  AtFacility: "Lấy mẫu tại cơ sở",
};

export const ServicesSection: React.FC = () => {
  const { token } = useAuth();
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [selectedTab, setSelectedTab] = useState<CollectionMethod>("SelfSample");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTests = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await getTestsApi(token);
        setTests(data);
      } catch (error) {
        console.error("Lỗi khi tải dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [token]);

  const filteredTests = tests.filter((test) =>
    test.priceServices.some((ps) => {
      if (selectedTab === "SelfSample") return ps.collectionMethod === 0;
      if (selectedTab === "AtFacility") return ps.collectionMethod === 1;
      return false;
    })
  );


  return (
    <View style={styles.wrapper}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(["SelfSample", "AtFacility"] as CollectionMethod[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
            ]}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tabLabels[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredTests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const matchingPrices = item.priceServices.filter((ps) =>
              selectedTab === "SelfSample" ? ps.collectionMethod === 0 : ps.collectionMethod === 1
            );

            return (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>

                {matchingPrices.map((price) => (
                  <View key={price.id} style={{ marginTop: 8 }}>
                    <Text>Giá: {price.price} {price.currency}</Text>
                    <Text>Hiệu lực: {price.effectiveFrom} - {price.effectiveTo}</Text>
                  </View>
                ))}
              </View>
            );
          }}
        />

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "center",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginHorizontal: 6,
  },
  activeTab: {
    backgroundColor: "#007bff",
  },
  tabText: {
    color: "#333",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    color: "#555",
    fontSize: 14,
  },
});
