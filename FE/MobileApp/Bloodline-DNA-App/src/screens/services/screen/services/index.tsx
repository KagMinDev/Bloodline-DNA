import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { Animated, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Activity, ArrowRight, Clipboard, Heart, Shield, UserCheck } from "react-native-feather";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/root-stack/stack.types"; // sửa lại đúng đường dẫn types nếu khác

export const ServicesSection: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const serviceCards = [
    {
      id: 1,
      title: "Cấp Cứu 24/7",
      description:
        "Dịch vụ y tế cấp cứu 24/7 với đội ngũ chuyên gia y tế giàu kinh nghiệm sẵn sàng xử lý các tình huống nguy cấp.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: true,
      hasFloatingIcon: false,
      overlayIcon: Heart,
      category: "Cấp Cứu",
      price: "24/7 Luôn Sẵn Sàng",
    },
    {
      id: 2,
      title: "Khám Sức Khỏe Định Kỳ",
      description:
        "Khám sức khỏe toàn diện và chăm sóc phòng ngừa để giúp duy trì sức khỏe tối ưu.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: Shield,
      category: "Phòng Ngừa",
      price: "Từ 1.500.000đ",
    },
    {
      id: 3,
      title: "Tư Vấn Chuyên Khoa",
      description:
        "Tư vấn chuyên sâu với các bác sĩ chuyên khoa được chứng nhận trong nhiều lĩnh vực y tế.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: Activity,
      category: "Tư Vấn",
      price: "Từ 2.000.000đ",
    },
    {
      id: 4,
      title: "Theo Dõi Sức Khỏe",
      description:
        "Theo dõi sức khỏe liên tục và các kế hoạch chăm sóc cá nhân hóa.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: UserCheck,
      category: "Theo Dõi",
      price: "Từ 990.000đ/tháng",
    },
    {
      id: 5,
      title: "Dịch Vụ Xét Nghiệm",
      description:
        "Xét nghiệm và chẩn đoán hiện đại với kết quả nhanh chóng, chính xác.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: Clipboard,
      category: "Chẩn Đoán",
      price: "Từ 750.000đ",
    },
    {
      id: 6,
      title: "Khám Từ Xa",
      description:
        "Tư vấn sức khỏe trực tuyến tại nhà với các nhà cung cấp dịch vụ chăm sóc sức khỏe.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: Activity,
      category: "Chăm Sóc Ảo",
      price: "Từ 1.200.000đ",
    },
  ];

  const handleCardPress = (cardId: number) => {
    console.log("Card pressed:", cardId);
  };

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.headerContainer}>
        <Text style={styles.subtitle}>DỊCH VỤ CỦA CHÚNG TÔI</Text>
        <Text style={styles.title}>Dịch Vụ Y Tế Chất Lượng Cao</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Giải pháp chăm sóc sức khỏe toàn diện được thiết kế riêng để đáp ứng
          nhu cầu cá nhân của bạn.
        </Text>
      </View>

      {/* Services grid */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        {serviceCards.map((card, index) => {
          const IconComponent = card.hasOverlay
            ? card.overlayIcon
            : card.floatingIcon;
          const animatedValue = new Animated.Value(0);

          const translateY = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          });

          const opacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            delay: index * 150,
            useNativeDriver: true,
          }).start();

          return (
            <Animated.View
              key={card.id}
              style={[
                styles.card,
                {
                  opacity,
                  transform: [{ translateY }],
                  marginLeft: index === 0 ? 20 : 0,
                  marginRight:
                    index === serviceCards.length - 1 ? 20 : 15,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(card.id)}
              >
                {/* Card Image */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: card.image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />

                  <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
                    style={styles.imageOverlay}
                  />

                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{card.category}</Text>
                  </View>

                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{card.price}</Text>
                  </View>

                  {card.hasFloatingIcon && IconComponent && (
                    <View style={styles.floatingIcon}>
                      <IconComponent width={24} height={24} color="white" />
                    </View>
                  )}
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text
                    style={styles.cardDescription}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {card.description}
                  </Text>

                  <TouchableOpacity style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreText}>Tìm Hiểu Thêm</Text>
                    <ArrowRight width={16} height={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* 👇 Nút chuyển trang Tất Cả Dịch Vụ */}
      <TouchableOpacity
        onPress={() => navigation.navigate("AllService")}
        style={styles.AllService}>
        <Text style={styles.AllServiceText}>
          Tất Cả Dịch Vụ
        </Text>
        <ArrowRight width={18} height={18} color="#1e3a8a" />
      </TouchableOpacity>

      {/* Call to action */}
      <LinearGradient
        colors={["#2563eb", "#1d4ed8"]}
        style={styles.ctaContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.ctaTitle}>Sẵn Sàng Bắt Đầu?</Text>
        <Text style={styles.ctaDescription}>
          Liên hệ với chúng tôi ngay hôm nay để đặt lịch tư vấn
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Đặt Lịch Hẹn</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
