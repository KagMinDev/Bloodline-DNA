import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowRight } from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../types/root-stack/stack.types";
import { getCategoryLabel, getCollectionMethodLabel, TestResponse } from "../../types/TestService";

interface Props { data: TestResponse; onPress?: () => void;}

const CardService: React.FC<Props> = ({ data, onPress }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const priceInfo = data.priceServices?.[0];

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={onPress}>
                {/* Header chứa tên và phương thức */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{data.name}</Text>
                        <Text style={styles.category}>{getCategoryLabel(data.category)}</Text>
                    </View>
                    <View style={styles.methodBox}>
                        <Text style={styles.methodLabel}>Phương thức</Text>
                        <Text style={styles.methodValue}>
                            {priceInfo
                                ? getCollectionMethodLabel(priceInfo.collectionMethod)
                                : "Không rõ"}
                        </Text>
                    </View>
                </View>

                {/* Mô tả */}
                <Text style={styles.description} numberOfLines={3}>
                    {data.description}
                </Text>

                {/* Giá + mũi tên */}
                <View style={styles.infoRow}>
                    <View style={styles.infoBox}>
                        <Text style={styles.label}>Giá</Text>
                        <Text style={styles.value}>
                            {priceInfo
                                ? `${priceInfo.price.toLocaleString()} ${priceInfo.currency}`
                                : "Không rõ"}
                        </Text>
                    </View>
                    <ArrowRight color="#2563EB" width={20} height={20} />
                </View>
            </TouchableOpacity>

            {/* Nút đặt lịch */}
            <TouchableOpacity
                style={styles.bookButton}
                onPress={() => {
                    navigation.navigate("AppointmentScreen", { serviceId: data.id });
                }}
            >
                <Text style={styles.bookButtonText}>Đặt lịch</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CardService;



const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    category: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },
    methodBox: {
        alignItems: "flex-end",
    },
    methodLabel: {
        fontSize: 12,
        color: "#9CA3AF",
        paddingRight: 5,
    },
    methodValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2563EB",
        paddingRight: 5,
    },
    description: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoBox: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    value: {
        fontSize: 14,
        fontWeight: "500",
        color: "#10B981",
    },
    bookButton: {
        position: "absolute",
        bottom: 12,
        right: 16,
        backgroundColor: "#2563EB",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
});

