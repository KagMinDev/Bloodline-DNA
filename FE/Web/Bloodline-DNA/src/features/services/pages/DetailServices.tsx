import {
  ActivityIcon,
  ArrowRightIcon,
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  HeartIcon,
  ShieldIcon,
  StarIcon,
  StethoscopeIcon
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Footer, Header } from "../../../components";
import { useBookingModal } from "../components/BookingModalContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  image: string;
  rating: number;
  reviews: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedService {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
}

export const DetailServices = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { openBookingModal } = useBookingModal();

  // Service data - this would typically come from props or API
  const serviceData = {
    title: "Khám Sức Khỏe Định Kỳ",
    subtitle: "Chăm sóc sức khỏe toàn diện và phòng ngừa",
    heroImage: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
    category: "Dịch Vụ Phòng Ngừa",
    duration: "2-3 giờ",
    description: "Dịch vụ khám sức khỏe định kỳ toàn diện của chúng tôi được thiết kế để phát hiện sớm các vấn đề sức khỏe tiềm ẩn và duy trì sức khỏe tối ưu cho bạn. Với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm và trang thiết bị y tế hiện đại.",
    overview: "Chương trình khám sức khỏe định kỳ bao gồm các xét nghiệm cơ bản đến chuyên sâu, giúp đánh giá tình trạng sức khỏe tổng thể và đưa ra các khuyến nghị phù hợp cho từng cá nhân."
  };

  const serviceFeatures: ServiceFeature[] = [
    {
      icon: <ShieldIcon className="w-8 h-8 text-blue-900" />,
      title: "An Toàn & Tin Cậy",
      description: "Quy trình chuẩn quốc tế, đảm bảo an toàn tuyệt đối cho người bệnh"
    },
    {
      icon: <AwardIcon className="w-8 h-8 text-blue-900" />,
      title: "Chuyên Gia Hàng Đầu",
      description: "Đội ngũ bác sĩ chuyên khoa được đào tạo bài bản, kinh nghiệm nhiều năm"
    },
    {
      icon: <ActivityIcon className="w-8 h-8 text-blue-900" />,
      title: "Công Nghệ Hiện Đại",
      description: "Trang thiết bị y tế tiên tiến, chính xác cao từ các thương hiệu hàng đầu"
    },
    {
      icon: <HeartIcon className="w-8 h-8 text-blue-900" />,
      title: "Chăm Sóc Tận Tâm",
      description: "Dịch vụ chu đáo, tư vấn chi tiết và theo dõi sức khỏe lâu dài"
    }
  ];

  const pricingPackages = [
    {
      name: "Gói Cơ Bản",
      price: "1.500.000",
      duration: "2 giờ",
      features: [
        "Khám tổng quát",
        "Xét nghiệm máu cơ bản",
        "Đo huyết áp, nhịp tim",
        "Tư vấn dinh dưỡng",
        "Báo cáo kết quả"
      ]
    },
    {
      name: "Gói Nâng Cao",
      price: "3.500.000",
      duration: "3 giờ",
      features: [
        "Tất cả gói cơ bản",
        "Siêu âm tổng quát",
        "X-quang phổi",
        "Xét nghiệm chuyên sâu",
        "Khám chuyên khoa",
        "Tư vấn từ chuyên gia"
      ],
      popular: true
    },
    {
      name: "Gói VIP",
      price: "6.500.000",
      duration: "Cả ngày",
      features: [
        "Tất cả gói nâng cao",
        "MRI/CT Scan",
        "Nội soi dạ dày",
        "Khám tim mạch chuyên sâu",
        "Phòng khám riêng",
        "Bữa ăn cao cấp",
        "Theo dõi 1 năm"
      ]
    }
  ];

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "BS.CK1 Nguyễn Văn An",
      specialization: "Nội Tim Mạch",
      experience: "15 năm kinh nghiệm",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.9,
      reviews: 234
    },
    {
      id: 2,
      name: "BS.CK2 Trần Thị Bình",
      specialization: "Nội Tiết",
      experience: "12 năm kinh nghiệm",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.8,
      reviews: 189
    },
    {
      id: 3,
      name: "BS.CK1 Lê Minh Đức",
      specialization: "Chẩn Đoán Hình Ảnh",
      experience: "18 năm kinh nghiệm",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.9,
      reviews: 312
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "Tôi cần chuẩn bị gì trước khi khám?",
      answer: "Bạn nên nhịn ăn 8-10 tiếng trước khi khám để đảm bảo kết quả xét nghiệm chính xác. Mang theo các kết quả khám trước đó (nếu có) và danh sách thuốc đang sử dụng."
    },
    {
      question: "Khám sức khỏe định kỳ mất bao lâu?",
      answer: "Tùy vào gói khám bạn chọn, thời gian có thể từ 2-6 giờ. Gói cơ bản khoảng 2 giờ, gói nâng cao 3-4 giờ, và gói VIP có thể mất cả ngày."
    },
    {
      question: "Khi nào tôi nhận được kết quả?",
      answer: "Hầu hết kết quả sẽ có ngay trong ngày khám. Một số xét nghiệm chuyên sâu có thể cần 1-2 ngày. Chúng tôi sẽ gọi điện thông báo khi có kết quả đầy đủ."
    },
    {
      question: "Có bảo hiểm y tế được không?",
      answer: "Chúng tôi chấp nhận hầu hết các loại bảo hiểm y tế. Vui lòng liên hệ trước để xác nhận và biết chi tiết về mức hỗ trợ của bảo hiểm."
    }
  ];

  const relatedServices: RelatedService[] = [
    {
      id: 1,
      title: "Khám Tim Mạch",
      price: "2.500.000đ",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      description: "Khám và tầm soát các bệnh lý tim mạch"
    },
    {
      id: 2,
      title: "Xét Nghiệm Tổng Quát",
      price: "1.200.000đ",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      description: "Xét nghiệm máu, nước tiểu toàn diện"
    },
    {
      id: 3,
      title: "Siêu Âm 4D",
      price: "800.000đ",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      description: "Siêu âm chẩn đoán hình ảnh chất lượng cao"
    }
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

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section - Medical Style */}
        <section className="relative w-full py-16 md:py-20 bg-blue-50 overflow-hidden">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-detail" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="#1e40af"/>
                  <rect x="4" y="8" width="12" height="4" fill="#1e40af"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-detail)" />
            </svg>
          </div>

          {/* Decorative Medical Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating medical icons */}
            <div className="absolute flex items-center justify-center w-16 h-16 rounded-full top-20 right-20 bg-blue-200/30 animate-pulse">
              <StethoscopeIcon className="w-8 h-8 text-blue-600/60" />
            </div>
            <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bottom-32 right-32 bg-blue-200/30 animate-bounce" style={{animationDelay: '1s'}}>
              <ActivityIcon className="w-6 h-6 text-blue-600/60" />
            </div>
            <div className="absolute flex items-center justify-center rounded-full top-32 left-32 w-14 h-14 bg-blue-200/30 animate-pulse" style={{animationDelay: '2s'}}>
              <ShieldIcon className="w-7 h-7 text-blue-600/60" />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex items-center h-full">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
              <div className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                {/* Breadcrumb */}
                <div className="mb-6">
                  <Breadcrumb>
                    <BreadcrumbList className="text-blue-600">
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                          Trang Chủ
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-blue-400" />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/services" className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                          Dịch Vụ
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-blue-400" />
                      <BreadcrumbItem>
                        <span className="text-blue-900 font-semibold">{serviceData.title}</span>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Title */}
                <h1 className="mb-4 text-3xl font-bold leading-tight text-blue-900 md:text-4xl lg:text-5xl">
                  {serviceData.title}
                  <span className="block text-blue-700 text-2xl md:text-3xl lg:text-4xl font-medium mt-1">
                    {serviceData.subtitle}
                  </span>
                </h1>

                {/* Description */}
                <p className="max-w-lg mb-6 text-base leading-relaxed md:text-lg text-blue-700">
                  Dịch vụ chuyên nghiệp với đội ngũ bác sĩ chuyên khoa và trang thiết bị y tế hiện đại nhất.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Overview */}
        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                  Tổng Quan Dịch Vụ
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-black">
                  {serviceData.description}
                </p>
                <p className="mb-8 text-lg leading-relaxed text-black">
                  {serviceData.overview}
                </p>
                <Button className="bg-blue-900 hover:bg-blue-800 !text-white px-6 py-3 rounded-full transition-all duration-300">
                  Tìm Hiểu Thêm
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="relative">
                <img 
                  src={serviceData.heroImage}
                  alt="Service Overview"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Features */}
        <section className="py-16 bg-blue-100 md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Tại Sao Chọn Chúng Tôi?
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-black whitespace-nowrap">
                Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao với những ưu điểm vượt trội
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-center transition-all duration-300 bg-white border-0 group hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 rounded-full bg-blue-50 group-hover:bg-blue-200">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-black">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Gói Khám Sức Khỏe
              </h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-black">
                Chọn gói khám phù hợp với nhu cầu và ngân sách của bạn
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {pricingPackages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl cursor-pointer ${
                    pkg.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border border-blue-200'
                  } ${selectedPackage === index ? 'ring-4 ring-blue-300' : ''}`}
                  onClick={() => setSelectedPackage(index)}
                >
                  {/* PHỔ BIẾN NHẤT Label */}
                  {pkg.popular && (
                    <div className="absolute top-0 left-0 right-0 z-10 py-2 text-sm font-semibold text-center text-white bg-blue-500">
                      PHỔ BIẾN NHẤT
                    </div>
                  )}
                  
                  {/* Header */}
                  <CardHeader className={`text-center ${pkg.popular ? 'pt-12' : 'pt-6'} pb-6`}>
                    <h3 className="mb-2 text-2xl font-bold text-blue-900">{pkg.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-700">{pkg.price}</span>
                      <span className="ml-1 text-black">VNĐ</span>
                    </div>
                    <p className="text-black">
                      <ClockIcon className="inline w-4 h-4 mr-1" />
                      {pkg.duration}
                    </p>
                  </CardHeader>
                  
                  {/* Nội dung và Button - sử dụng flex để button luôn ở dưới */}
                  <CardContent className="flex flex-col flex-grow px-6 pb-6">
                    <ul className="flex-grow mb-6 space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircleIcon className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
                          <span className="text-black">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Button luôn ở dưới cùng */}
                    <Button 
                      className={`w-full py-3 rounded-full font-semibold transition-all duration-300 mt-auto ${
                        pkg.popular 
                          ? 'bg-blue-500 !text-white hover:bg-blue-600' 
                          : 'bg-blue-900 !text-white hover:bg-blue-800'
                      }`}
                    >
                      Chọn Gói Này
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Doctor Profiles */}
        <section className="py-16 bg-blue-100 md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Đội Ngũ Bác Sĩ
              </h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-black">
                Các chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden transition-all duration-300 bg-white border-0 group hover:shadow-xl hover:-translate-y-2">
                  <div className="relative overflow-hidden h-80">
                    <img 
                      src={doctor.image}
                      alt={doctor.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/50 to-transparent group-hover:opacity-100"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">
                      {doctor.name}
                    </h3>
                    <p className="mb-2 font-semibold text-blue-600">{doctor.specialization}</p>
                    <p className="mb-4 text-black">{doctor.experience}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold text-black">{doctor.rating}</span>
                        <span className="ml-1 text-black">({doctor.reviews} đánh giá)</span>
                      </div>
                      <Button variant="outline" size="sm" className="text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white">
                        Xem Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-lg leading-relaxed text-black">
                Những thắc mắc phổ biến về dịch vụ khám sức khỏe
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden transition-colors duration-200 border border-blue-200 hover:border-blue-400">
                  <CardHeader 
                    className="transition-colors duration-200 cursor-pointer hover:bg-blue-50"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-900">{faq.question}</h3>
                      {openFAQ === index ? (
                        <ChevronUpIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardHeader>
                  
                  {openFAQ === index && (
                    <CardContent className="pt-0 pb-6">
                      <p className="leading-relaxed text-black">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 bg-blue-100 md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Dịch Vụ Liên Quan
              </h2>
              <p className="text-lg leading-relaxed text-black">
                Khám phá thêm các dịch vụ y tế khác
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedServices.map((service) => (
                <Card key={service.id} className="overflow-hidden transition-all duration-300 bg-white border-0 cursor-pointer group hover:shadow-xl hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">
                      {service.title}
                    </h3>
                    <p className="mb-4 leading-relaxed text-black">
                      {service.description}
                    </p>
                    <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:!text-white">
                      Xem Chi Tiết
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="w-full px-4 text-center md:px-6 lg:px-8">
            <h2 className="block mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl whitespace-nowrap">
              Sẵn Sàng Bắt Đầu Hành Trình Chăm Sóc Sức Khỏe?
            </h2>
            <p className="mb-8 text-xl text-white/90 whitespace-nowrap">
              Đặt lịch khám ngay hôm nay để nhận được sự chăm sóc tốt nhất từ đội ngũ chuyên gia của chúng tôi
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                onClick={openBookingModal}
                className="px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-100 hover:text-blue-900"
              >
                <CalendarIcon className="w-10 h-10 mr-2" />
                Đặt Lịch Ngay
              </Button>
              {/* <Button variant="outline" className="px-8 py-4 text-lg text-white border-white rounded-full hover:bg-white hover:text-blue-900">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Hotline: 1900-xxxx
              </Button> */}
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