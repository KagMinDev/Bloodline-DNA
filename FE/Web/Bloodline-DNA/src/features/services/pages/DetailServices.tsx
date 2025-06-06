import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  StarIcon, 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon,
  ShieldIcon,
  AwardIcon,
  HeartIcon,
  ActivityIcon,
  StethoscopeIcon,
  ChevronDownIcon,
  ChevronUpIcon
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
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden">
          {/* Background with parallax */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-75 ease-out"
            style={{
              backgroundImage: `url(${serviceData.heroImage})`,
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/75" />

          {/* Content - Left aligned to match the image */}
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
                    <BreadcrumbLink href="/services" className="text-slate-600 hover:text-blue-800 transition-colors duration-200">
                      Dịch Vụ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-400" />
                  <BreadcrumbItem>
                    <span className="text-blue-800 font-semibold">{serviceData.title}</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Title - Enhanced with gradient colors */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent leading-tight">
              {serviceData.title}
            </h1>
          </div>
        </section>

        {/* Service Overview */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                  Tổng Quan Dịch Vụ
                </h2>
                <p className="text-lg text-black mb-6 leading-relaxed">
                  {serviceData.description}
                </p>
                <p className="text-lg text-black mb-8 leading-relaxed">
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
        <section className="py-16 md:py-20 bg-blue-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                Tại Sao Chọn Chúng Tôi?
              </h2>
              <p className="text-lg text-black max-w-3xl mx-auto whitespace-nowrap">
                Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao với những ưu điểm vượt trội
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="group text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
                  <CardContent className="p-0">
                    <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                      <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-black leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                Gói Khám Sức Khỏe
              </h2>
              <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
                Chọn gói khám phù hợp với nhu cầu và ngân sách của bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 font-semibold text-sm z-10">
                      PHỔ BIẾN NHẤT
                    </div>
                  )}
                  
                  {/* Header */}
                  <CardHeader className={`text-center ${pkg.popular ? 'pt-12' : 'pt-6'} pb-6`}>
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">{pkg.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-700">{pkg.price}</span>
                      <span className="text-black ml-1">VNĐ</span>
                    </div>
                    <p className="text-black">
                      <ClockIcon className="w-4 h-4 inline mr-1" />
                      {pkg.duration}
                    </p>
                  </CardHeader>
                  
                  {/* Nội dung và Button - sử dụng flex để button luôn ở dưới */}
                  <CardContent className="flex flex-col flex-grow px-6 pb-6">
                    <ul className="space-y-3 mb-6 flex-grow">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
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
        <section className="py-16 md:py-20 bg-blue-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                Đội Ngũ Bác Sĩ
              </h2>
              <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
                Các chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0">
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-2">{doctor.specialization}</p>
                    <p className="text-black mb-4">{doctor.experience}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold text-black">{doctor.rating}</span>
                        <span className="ml-1 text-black">({doctor.reviews} đánh giá)</span>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
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
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-lg text-black leading-relaxed">
                Những thắc mắc phổ biến về dịch vụ khám sức khỏe
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border border-blue-200 overflow-hidden hover:border-blue-400 transition-colors duration-200">
                  <CardHeader 
                    className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex justify-between items-center">
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
                      <p className="text-black leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 md:py-20 bg-blue-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                Dịch Vụ Liên Quan
              </h2>
              <p className="text-lg text-black leading-relaxed">
                Khám phá thêm các dịch vụ y tế khác
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((service) => (
                <Card key={service.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-black mb-4 leading-relaxed">
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
          <div className="w-full px-4 md:px-6 lg:px-8 text-center">
            <h2 className="block text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 whitespace-nowrap">
              Sẵn Sàng Bắt Đầu Hành Trình Chăm Sóc Sức Khỏe?
            </h2>
            <p className="text-xl text-white/90 mb-8 whitespace-nowrap">
              Đặt lịch khám ngay hôm nay để nhận được sự chăm sóc tốt nhất từ đội ngũ chuyên gia của chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-900 hover:bg-blue-100 hover:text-blue-900 px-8 py-4 rounded-full text-lg font-semibold">
                <CalendarIcon className="w-10 h-10 mr-2" />
                Đặt Lịch Ngay
              </Button>
              {/* <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-full text-lg">
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