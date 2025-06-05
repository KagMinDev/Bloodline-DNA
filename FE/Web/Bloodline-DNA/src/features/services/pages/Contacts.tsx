import React, { useEffect, useState, useRef } from "react";
import { 
  PhoneIcon, 
  MailIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
  MessageSquareIcon,
  UserIcon,
  BuildingIcon,
  CarIcon,
  CreditCardIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ArrowRightIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Header } from "../../../components";
import { Footer } from "../../../components";

interface ContactInfo {
  id: number;
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  type: 'phone' | 'email' | 'address' | 'hours';
  link?: string;
}

interface OfficeHour {
  day: string;
  hours: string;
  isToday?: boolean;
}

export const Contacts = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const contactInfo: ContactInfo[] = [
    {
      id: 1,
      title: "Hotline 24/7",
      description: "Hỗ trợ khẩn cấp và tư vấn",
      value: "1900-xxxx",
      icon: <PhoneIcon className="w-8 h-8 text-blue-600" />,
      type: 'phone',
      link: "tel:1900xxxx"
    },
    {
      id: 2,
      title: "Email Hỗ Trợ",
      description: "Gửi câu hỏi và nhận tư vấn",
      value: "support@hospital.vn",
      icon: <MailIcon className="w-8 h-8 text-blue-600" />,
      type: 'email',
      link: "mailto:support@hospital.vn"
    },
    {
      id: 3,
      title: "Địa Chỉ Bệnh Viện",
      description: "Số 123, Đường ABC, Quận XYZ",
      value: "TP. Hồ Chí Minh",
      icon: <MapPinIcon className="w-8 h-8 text-blue-600" />,
      type: 'address',
      link: "https://maps.google.com"
    },
    {
      id: 4,
      title: "Giờ Làm Việc",
      description: "Thứ 2 - Chủ Nhật",
      value: "24/7",
      icon: <ClockIcon className="w-8 h-8 text-blue-600" />,
      type: 'hours'
    }
  ];

  const officeHours: OfficeHour[] = [
    { day: "Thứ Hai", hours: "7:00 - 22:00" },
    { day: "Thứ Ba", hours: "7:00 - 22:00", isToday: true },
    { day: "Thứ Tư", hours: "7:00 - 22:00" },
    { day: "Thứ Năm", hours: "7:00 - 22:00" },
    { day: "Thứ Sáu", hours: "7:00 - 22:00" },
    { day: "Thứ Bảy", hours: "8:00 - 20:00" },
    { day: "Chủ Nhật", hours: "8:00 - 18:00" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden">
          {/* Background with parallax */}
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out"
            style={{
              backgroundImage: `url("https://i.ibb.co/S4f76rCX/snapedit-1749107627900.png")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/75 to-white/65" />

          {/* Content */}
          <div className={`absolute top-1/2 left-8 md:left-12 lg:left-16 xl:left-20 -translate-y-1/2 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb>
                <BreadcrumbList className="text-slate-600">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-slate-600 hover:text-blue-800 transition-colors duration-200">
                      Trang Chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-400" />
                  <BreadcrumbItem>
                    <span className="text-blue-800 font-semibold">Liên Hệ</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Title - Enhanced with gradient colors */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent leading-tight mb-4">
              Liên Hệ
            </h1>
            {/* <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl">
              Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
            </p> */}
          </div>
        </section>

        {/* Contact Form & Contact Info */}
        <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                      Gửi Tin Nhắn
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                          Họ và Tên *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                          Số Điện Thoại *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                          placeholder="0912 345 678"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                        Chủ Đề
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="appointment">Đặt lịch khám</option>
                        <option value="consultation">Tư vấn y tế</option>
                        <option value="emergency">Cấp cứu</option>
                        <option value="feedback">Góp ý</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                        Tin Nhắn *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                        placeholder="Nhập tin nhắn của bạn..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800 !text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang Gửi...
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-5 h-5 mr-2" />
                          Gửi Tin Nhắn
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info Cards in Sidebar */}
              <div className="lg:col-span-2 space-y-8">
                {/* Top Row: Emergency and Location */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Emergency/Hotline Card */}
                  <Card
                    className="w-full aspect-square group text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center"
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 shadow-lg">
                          <PhoneIcon className="w-8 h-8 text-blue-700" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors duration-300 uppercase tracking-wider whitespace-nowrap">
                        Hotline 24/7
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 mb-3 whitespace-nowrap text-center">
                          Hỗ trợ khẩn cấp và tư vấn
                        </p>
                        <a
                          href="tel:1900xxxx"
                          className="block text-lg font-semibold text-blue-800 hover:text-blue-900 transition-colors duration-200 whitespace-nowrap"
                        >
                          1900-xxxx
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Card */}
                  <Card
                    className="w-full aspect-square group text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center"
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300 shadow-lg">
                          <MapPinIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300 uppercase tracking-wider">
                        Địa Chỉ
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-white/90 mb-2 whitespace-nowrap text-center">
                          Số 123, Đường ABC, Quận XYZ
                        </p>
                        <a
                          href="https://maps.google.com"
                          className="block text-lg font-semibold text-white hover:text-gray-200 transition-colors duration-200 whitespace-nowrap"
                        >
                          TP. Hồ Chí Minh
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Row: Email and Working Hours */}
                <div className="grid grid-cols-2 gap-8">
  {/* Email Card */}
  <Card
    className="
      w-full aspect-square             /* đảm bảo width = height */
      group text-center
      p-6                               /* giảm padding để tránh nội dung chèn tràn */
      hover:shadow-xl transition-all duration-300 hover:-translate-y-2
      border-0 bg-gradient-to-br from-blue-100 to-blue-50
      flex flex-col justify-center items-center  /* căn giữa nội dung */
      overflow-hidden                    /* nếu nội dung quá cao sẽ bị ẩn bớt */
    "
  >
    <CardContent className="p-0 flex flex-col justify-center items-center">
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 shadow-lg">
          <MailIcon className="w-8 h-8 text-blue-700" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 uppercase tracking-wider">
        Email
      </h3>
      <p className="text-sm text-slate-600 mb-3 text-center whitespace-nowrap">
        Gửi câu hỏi và nhận tư vấn
      </p>
      <a
        href="mailto:support@hospital.vn"
        className="text-base font-semibold text-blue-800 hover:text-blue-900 transition-colors duration-200 break-words text-center"
      >
        support@hospital.vn
      </a>
    </CardContent>
  </Card>

  {/* Working Hours Card */}
  <Card
    className="
      w-full aspect-square
      group text-center
      p-6
      hover:shadow-xl transition-all duration-300 hover:-translate-y-2
      border-0 bg-gradient-to-br from-blue-100 to-blue-50
      flex flex-col justify-center items-center
      overflow-hidden
    "
  >
    <CardContent className="p-0 flex flex-col justify-center items-center">
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 shadow-lg">
          <ClockIcon className="w-8 h-8 text-blue-700" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 uppercase tracking-wider">
        Giờ Làm Việc
      </h3>
      <p className="text-sm text-slate-600 mb-3 text-center">
        Thứ 2 – Chủ Nhật
      </p>
      <p className="text-lg font-semibold text-blue-800 text-center">
        24/7
      </p>
    </CardContent>
  </Card>
</div>

              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Vị Trí Bệnh Viện
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Chúng tôi có vị trí thuận lợi, dễ dàng di chuyển bằng các phương tiện giao thông
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4967970106!2d106.6981!3d10.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529432c6b6c9d%3A0x15b5b5c5b5c5b5c5!2sSaigon!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                  ></iframe>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-6">
                <Card className="bg-blue-50 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      Địa Chỉ Chi Tiết
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Số 123, Đường ABC, Phường XYZ<br />
                      Quận 1, TP. Hồ Chí Minh<br />
                      Việt Nam
                    </p>
                    <Button className="bg-blue-900 hover:bg-blue-800 !text-white">
                      <ArrowRightIcon className="w-4 h-4 mr-2" />
                      Chỉ Đường
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <CarIcon className="w-5 h-5 mr-2" />
                      Giao Thông
                    </h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Xe bus: Tuyến 01, 02, 03</li>
                      <li>• Metro: Ga Bến Thành (500m)</li>
                      <li>• Taxi/Grab: Có sẵn</li>
                      <li>• Bãi đỗ xe: Miễn phí</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Cần Hỗ Trợ Khẩn Cấp?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Đội ngũ y bác sĩ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-900 px-8 py-4 rounded-full text-lg font-semibold">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Gọi Ngay
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-full text-lg">
                <MessageSquareIcon className="w-5 h-5 mr-2" />
                Chat Trực Tuyến
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
}; 