import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Testimonial } from "../../../../types/home/home.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const testimonials: Testimonial[] = [
  {
    content:
      "Dịch vụ rất chuyên nghiệp, kết quả nhanh và bảo mật. Tôi đã xác định được quan hệ huyết thống một cách dễ dàng.",
    name: "Nguyễn Văn A",
    location: "Hà Nội",
    rating: 5,
  },
  {
    content:
      "Đội ngũ hỗ trợ rất nhiệt tình, giải đáp mọi thắc mắc. Kết quả chính xác và đáng tin cậy.",
    name: "Trần Thị B",
    location: "TP. HCM",
    rating: 4.5,
  },
  {
    content:
      "Quy trình đơn giản, tôi chỉ cần đặt lịch và nhận kết quả qua email. Rất tiện lợi!",
    name: "Lê Văn C",
    location: "Đà Nẵng",
    rating: 5,
  },
  {
    content:
      "Rất hài lòng với dịch vụ. Nhân viên tận tình, kết quả chính xác và nhanh chóng.",
    name: "Võ Thị D",
    location: "Cần Thơ",
    rating: 4,
  },
  {
    content:
      "Công nghệ hiện đại, quy trình minh bạch. Tôi cảm thấy yên tâm khi sử dụng dịch vụ.",
    name: "Hoàng Văn E",
    location: "Hải Phòng",
    rating: 5,
  },
];

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  index: number;
}> = ({ testimonial, index }) => (
  <View style={styles.testimonialCard}>
    <View style={styles.ratingContainer}>
      {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={20}
          color="#FBBF24" // text-yellow-400
          style={styles.star}
        />
      ))}
      {testimonial.rating % 1 !== 0 && (
        <Icon
          name="star-half-full"
          size={20}
          color="#FBBF24"
          style={styles.star}
        />
      )}
    </View>
    <Text style={styles.content}>"{testimonial.content}"</Text>
    <View style={styles.footer}>
      <Text style={styles.name}>{testimonial.name}</Text>
      <Text style={styles.location}>{testimonial.location}</Text>
    </View>
  </View>
);

const TestimonialsSection: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const data = [...testimonials, ...testimonials]; // Lặp lại để cuộn vô hạn

  // Cuộn tự động
  useEffect(() => {
    let scrollOffset = 0;
    const interval = setInterval(() => {
      scrollOffset += width * 0.8; // Cuộn 80% chiều rộng màn hình
      if (scrollOffset >= data.length * width * 0.8) {
        scrollOffset = 0; // Reset về đầu
      }
      scrollViewRef.current?.scrollTo({
        x: scrollOffset,
        animated: true,
      });
    }, 3000); // Cuộn mỗi 3 giây

    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <View
      style={[styles.container, { backgroundColor: "#2563EB" }]} // Fallback solid color
    >
      <View style={styles.content}>
        <Text style={styles.title}>Khách hàng nói gì về chúng tôi</Text>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.8} // Snap theo chiều rộng thẻ
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
        >
          {data.map((item, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={item} 
              index={index} 
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TestimonialsSection;