import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FAQ } from "../../../../types/home/home.types";
import { styles } from "./styles";

const faqs: FAQ[] = [
  {
    key: "1",
    question: "Xét nghiệm ADN huyết thống có chính xác không?",
    answer:
      "Có, xét nghiệm của chúng tôi đạt độ chính xác 99.99% nhờ công nghệ phân tích ADN tiên tiến và quy trình kiểm soát chất lượng nghiêm ngặt.",
  },
  {
    key: "2",
    question: "Mất bao lâu để nhận kết quả?",
    answer:
      "Kết quả thường được gửi trong vòng 3-5 ngày làm việc sau khi nhận mẫu, tùy thuộc vào loại xét nghiệm.",
  },
  {
    key: "3",
    question: "Thông tin của tôi có được bảo mật không?",
    answer:
      "Tuyệt đối! Mọi dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế. Chúng tôi không chia sẻ thông tin với bên thứ ba.",
  },
  {
    key: "4",
    question: "Cần chuẩn bị gì trước khi lấy mẫu ADN?",
    answer:
      "Không cần chuẩn bị đặc biệt. Chỉ cần đến cơ sở hoặc sắp xếp lấy mẫu tại nhà theo lịch hẹn.",
  },
  {
    key: "5",
    question: "Xét nghiệm có thể thực hiện cho trẻ em không?",
    answer:
      "Có, xét nghiệm ADN an toàn cho mọi lứa tuổi, bao gồm trẻ em, với quy trình lấy mẫu không xâm lấn.",
  },
];

const FAQSection: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setActiveKey(activeKey === key ? null : key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Câu hỏi thường gặp</Text>
        {faqs.map((faq) => (
          <View key={faq.key} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => toggleAccordion(faq.key)}
            >
              <Text style={styles.question}>{faq.question}</Text>
              <Icon
                name="message-text"
                size={20}
                color="#2563EB"
                style={[
                  styles.icon,
                  { transform: [{ rotate: activeKey === faq.key ? "90deg" : "0deg" }] },
                ]}
              />
            </TouchableOpacity>
            {activeKey === faq.key && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default FAQSection;