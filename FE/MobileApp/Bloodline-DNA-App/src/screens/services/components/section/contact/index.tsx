import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring
} from 'react-native-reanimated';
import styles from './styles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_MARGIN = width * 0.05;

type ContactDetail = {
  text: string;
  isLink: boolean;
  href?: string;
  textStyle?: object;
};

type ContactItem = {
  id: string;
  title: string;
  iconName: string;
  details: ContactDetail[];
  color: string;
  iconBgColor: string;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Custom hook để tạo animated values
const useAnimatedCards = (count: number) => {
  const values = [];
  
  for (let i = 0; i < count; i++) {
    values.push({
      opacity: useSharedValue(0),
      translateY: useSharedValue(30),
    });
  }
  
  return values;
};

export const ContactSection = () => {
  const contactData: ContactItem[] = [
    {
      id: '1',
      title: 'CẤP CỨU',
      iconName: 'phone',
      details: [
        { text: '(84) 28-3822-4567', isLink: true, href: 'tel:+842838224567' },
        { text: '(84) 911-234-567', isLink: true, href: 'tel:+84911234567' },
      ],
      color: '#f97316',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },
    {
      id: '2',
      title: 'ĐỊA CHỈ',
      iconName: 'map-pin',
      details: [
        { text: '123 Đường Y Tế', isLink: false },
        {
          text: 'Quận Y Tế, TP.HCM 70000',
          isLink: true,
          href: 'https://maps.google.com?q=123+Duong+Y+Te+TPHCM',
        },
      ],
      color: '#2563eb',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },
    {
      id: '3',
      title: 'EMAIL',
      iconName: 'mail',
      details: [
        { text: 'info@benhvien.vn', isLink: true, href: 'mailto:info@benhvien.vn' },
        {
          text: 'hotro@benhvien.vn',
          isLink: true,
          href: 'mailto:hotro@benhvien.vn',
          textStyle: { fontSize: 14, opacity: 0.9 },
        },
      ],
      color: '#10b981',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },
    {
      id: '4',
      title: 'GIỜ LÀM VIỆC',
      iconName: 'clock',
      details: [
        { text: 'T2-T7: 07:00-19:00', isLink: false },
        { text: 'Chủ nhật: Chỉ cấp cứu', isLink: false, textStyle: { fontSize: 14, opacity: 0.9 } },
      ],
      color: '#7c3aed',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
    },
  ];

  // Sử dụng custom hook để tạo animated values
  const animatedValues = useAnimatedCards(contactData.length);

  // Khởi động animations
  useEffect(() => {
    animatedValues.forEach((animValue, index) => {
      animValue.opacity.value = withDelay(
        index * 150,
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      animValue.translateY.value = withDelay(
        index * 150,
        withSpring(0, { damping: 10, stiffness: 100 })
      );
    });
  }, []);

  const handleLinkPress = async (href?: string) => {
    if (href && await Linking.canOpenURL(href)) {
      await Linking.openURL(href);
    }
  };

  const ContactCard = ({ item, index }: { item: ContactItem; index: number }) => {
    const animationStyle = useAnimatedStyle(() => {
      return {
        opacity: animatedValues[index].opacity.value,
        transform: [{ translateY: animatedValues[index].translateY.value }],
      };
    });

    return (
      <AnimatedTouchable
        style={[
          styles.card,
          { backgroundColor: item.color },
          animationStyle
        ]}
        activeOpacity={0.9}
        onPress={() => {}}
      >
        <View style={styles.cardInner}>
          <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
            <Feather name={item.iconName as any} size={32} color="#fff" />
          </View>

          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.details.map((detail, idx) => (
              <TouchableOpacity
                key={idx}
                disabled={!detail.isLink}
                onPress={() => detail.href && handleLinkPress(detail.href)}
              >
                <Text style={[styles.cardText, detail.textStyle]}>
                  {detail.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subHeader}>LIÊN HỆ NGAY</Text>
        <Text style={styles.mainHeader}>Thông Tin Liên Hệ</Text>
        <View style={styles.headerLine} />
        <Text style={styles.headerText}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ qua các kênh dưới đây.
        </Text>
      </View>

      {/* Contact cards - Sử dụng ScrollView thay vì FlatList để tránh nested VirtualizedList */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {contactData.map((item, index) => (
          <ContactCard key={item.id} item={item} index={index} />
        ))}
      </ScrollView>
    </View>
  );
};