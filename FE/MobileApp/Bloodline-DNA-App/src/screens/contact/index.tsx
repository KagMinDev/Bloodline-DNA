import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import MapView, { Marker } from 'react-native-maps';

// Assuming Header and Footer are custom components adapted for React Native
import { Footer } from "@/components";
import Header from "@/components/common/header-main";
import { ContactInfo, OfficeHour } from "@/types/contact/contact.types";
import Icon from "react-native-vector-icons/Feather"; // or MaterialIcons, FontAwesome, etc.
import styles from "./styles";

const Contacts: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const contactInfo: ContactInfo[] = [
    {
      id: 1,
      title: "Hotline 24/7",
      description: "Hỗ trợ khẩn cấp và tư vấn",
      value: "1900-xxxx",
      icon: "phone",
      type: "phone",
      link: "tel:1900xxxx",
    },
    {
      id: 2,
      title: "Email Hỗ Trợ",
      description: "Gửi câu hỏi và nhận tư vấn",
      value: "support@hospital.vn",
      icon: "mail",
      type: "email",
      link: "mailto:support@hospital.vn",
    },
    {
      id: 3,
      title: "Địa Chỉ Bệnh Viện",
      description: "Số 123, Đường ABC, Quận XYZ",
      value: "TP. Hồ Chí Minh",
      icon: "map-pin",
      type: "address",
      link: "https://maps.google.com",
    },
    {
      id: 4,
      title: "Giờ Làm Việc",
      description: "Thứ 2 - Chủ Nhật",
      value: "24/7",
      icon: "clock",
      type: "hours",
    },
  ];

  const officeHours: OfficeHour[] = [
    { day: "Thứ Hai", hours: "7:00 - 22:00" },
    { day: "Thứ Ba", hours: "7:00 - 22:00", isToday: true },
    { day: "Thứ Tư", hours: "7:00 - 22:00" },
    { day: "Thứ Năm", hours: "7:00 - 22:00" },
    { day: "Thứ Sáu", hours: "7:00 - 22:00" },
    { day: "Thứ Bảy", hours: "8:00 - 20:00" },
    { day: "Chủ Nhật", hours: "8:00 - 18:00" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      Alert.alert(
        "Thành công",
        "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ."
      );
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 2000);
  };

  const openLink = (link?: string) => {
    if (link) {
      Linking.openURL(link).catch((err) =>
        Alert.alert("Lỗi", "Không thể mở liên kết.")
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ref={scrollViewRef}
      onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <View style={[styles.heroSection, { opacity: isVisible ? 1 : 0 }]}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Liên Hệ Với Chúng Tôi</Text>

          <Text style={styles.heroDescription}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc với đội ngũ
            chăm sóc khách hàng chuyên nghiệp.
          </Text>
          <Text style={styles.heroSubtitle}>Hỗ Trợ 24/7</Text>

        </View>
      </View>

      {/* Contact Form & Info */}
      <View style={styles.contactSection}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Gửi Tin Nhắn</Text>
          <Text style={styles.sectionDescription}>
            Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất
            có thể
          </Text>

          <View style={styles.form}>
            <View style={styles.formRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Họ và Tên *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Nhập họ và tên của bạn"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Số Điện Thoại *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  placeholder="0912 345 678"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="email@example.com"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Chủ Đề</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.subject}
                  onValueChange={(value) => handleInputChange("subject", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn chủ đề" value="" />
                  <Picker.Item label="Đặt lịch khám" value="appointment" />
                  <Picker.Item label="Tư vấn y tế" value="consultation" />
                  <Picker.Item label="Cấp cứu" value="emergency" />
                  <Picker.Item label="Góp ý" value="feedback" />
                  <Picker.Item label="Khác" value="other" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tin Nhắn *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.message}
                onChangeText={(text) => handleInputChange("message", text)}
                placeholder="Nhập tin nhắn của bạn..."
                multiline
                numberOfLines={5}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <View style={styles.spinner} />
                  <Text style={styles.submitButtonText}>Đang Gửi...</Text>
                </>
              ) : (
                <>
                  <Icon
                    name="send"
                    size={20}
                    color="#fff"
                    style={styles.submitButtonIcon}
                  />
                  <Text style={styles.submitButtonText}>Gửi Tin Nhắn</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info Cards */}
        <View style={styles.contactInfoContainer}>
          {contactInfo.map((info) => (
            <TouchableOpacity
              key={info.id}
              style={styles.contactCard}
              onPress={() => openLink(info.link)}
              disabled={!info.link}
            >
              <View style={styles.contactCardIconContainer}>
                <Icon name={info.icon} size={32} color="#1E40AF" />
              </View>
              <Text style={styles.contactCardTitle}>{info.title}</Text>
              <Text style={styles.contactCardDescription}>
                {info.description}
              </Text>
              <Text style={styles.contactCardValue}>{info.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Vị Trí Bệnh Viện</Text>
        <Text style={styles.sectionDescription}>
          Chúng tôi có vị trí thuận lợi, dễ dàng di chuyển bằng các phương tiện
          giao thông
        </Text>
        {/* <MapView
          style={styles.mapContainer}
          initialRegion={{
            latitude: 10.762622,
            longitude: 106.660172,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: 10.762622, longitude: 106.660172 }}
            title="Bệnh Viện"
          />
        </MapView> */}
        <View style={styles.locationInfo}>
          <View style={styles.locationCard}>
            <Text style={styles.locationCardTitle}>
              <Icon name="map-pin" size={20} color="#1E40AF" /> Địa Chỉ Chi Tiết
            </Text>
            <Text style={styles.locationCardText}>
              Số 123, Đường ABC, Phường XYZ{"\n"}
              Quận 1, TP. Hồ Chí Minh{"\n"}
              Việt Nam
            </Text>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => openLink("https://maps.google.com")}
            >
              <Icon name="arrow-right" size={16} color="#fff" />
              <Text style={styles.directionButtonText}>Chỉ Đường</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.locationCard}>
            <Text style={styles.locationCardTitle}>
              <Icon name="truck" size={20} color="#1E40AF" /> Giao Thông
            </Text>
            <Text style={styles.locationCardText}>
              • Xe bus: Tuyến 01, 02, 03{"\n"}• Metro: Ga Bến Thành (500m){"\n"}
              • Taxi/Grab: Có sẵn{"\n"}• Bãi đỗ xe: Miễn phí
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Footer />
    </ScrollView>
  );
};

export default Contacts;
