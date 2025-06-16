import {
  ActivityIcon,
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  HeartIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  StethoscopeIcon,
  UserCheckIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Footer, Header } from "../../../components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  doctor: string;
  location: string;
  available: boolean;
  featured: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

export const Services = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/services/${id}`);
  };

  const categories: ServiceCategory[] = [
    {
      id: "all",
      name: "Tất Cả",
      icon: <StethoscopeIcon className="w-5 h-5" />,
      count: 12
    },
    {
      id: "emergency",
      name: "Cấp Cứu",
      icon: <HeartIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "checkup",
      name: "Khám Định Kỳ",
      icon: <ShieldIcon className="w-5 h-5" />,
      count: 3
    },
    {
      id: "consultation",
      name: "Tư Vấn",
      icon: <ActivityIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "diagnostic",
      name: "Chẩn Đoán",
      icon: <ClipboardCheckIcon className="w-5 h-5" />,
      count: 3
    },
    {
      id: "monitoring",
      name: "Theo Dõi",
      icon: <UserCheckIcon className="w-5 h-5" />,
      count: 2
    }
  ];

  const services: Service[] = [
    {
      id: 1,
      title: "Cấp Cứu 24/7",
      description: "Dịch vụ y tế cấp cứu 24/7 với đội ngũ chuyên gia y tế giàu kinh nghiệm sẵn sàng xử lý các tình huống nguy cấp với sự chăm sóc và chính xác tối đa.",
      category: "emergency",
      price: "24/7 Luôn Sẵn Sàng",
      duration: "Liên tục",
      rating: 4.9,
      reviews: 456,
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      features: ["Xe cấp cứu", "Hồi sức cấp cứu", "Phẫu thuật khẩn cấp", "Chăm sóc đặc biệt"],
      doctor: "BS.CK2 Nguyễn Văn An",
      location: "Khoa Cấp Cứu",
      available: true,
      featured: true
    },
    {
      id: 2,
      title: "Khám Sức Khỏe Tổng Quát",
      description: "Khám sức khỏe toàn diện và chăm sóc phòng ngừa để giúp duy trì sức khỏe tối ưu và phát hiện sớm các vấn đề tiềm ẩn.",
      category: "checkup",
      price: "1.500.000đ",
      duration: "2-3 giờ",
      rating: 4.8,
      reviews: 234,
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      features: ["Xét nghiệm máu", "Siêu âm tổng quát", "X-quang", "Tư vấn dinh dưỡng"],
      doctor: "BS. Trần Thị Lan",
      location: "Khoa Khám Bệnh",
      available: true,
      featured: true
    },
    {
      id: 3,
      title: "Tư Vấn Tim Mạch",
      description: "Tư vấn chuyên sâu với các bác sĩ chuyên khoa tim mạch được chứng nhận để giải quyết các vấn đề về tim mạch.",
      category: "consultation",
      price: "2.000.000đ",
      duration: "45 phút",
      rating: 4.9,
      reviews: 189,
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      features: ["Siêu âm tim", "Điện tim", "Test gắng sức", "Tư vấn điều trị"],
      doctor: "BS.CK2 Lê Minh Đức",
      location: "Khoa Tim Mạch",
      available: true,
      featured: true
    },
    {
      id: 4,
      title: "Xét Nghiệm Máu",
      description: "Xét nghiệm máu toàn diện với kết quả nhanh chóng, chính xác được thực hiện bởi các kỹ thuật viên được chứng nhận.",
      category: "diagnostic",
      price: "750.000đ",
      duration: "30 phút",
      rating: 4.7,
      reviews: 345,
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      features: ["Sinh hóa máu", "Huyết học", "Miễn dịch", "Nội tiết"],
      doctor: "BS. Phạm Thu Hoa",
      location: "Khoa Xét Nghiệm",
      available: true,
      featured: false
    },
    {
      id: 5,
      title: "Khám Mắt",
      description: "Khám và điều trị các bệnh lý về mắt với trang thiết bị hiện đại và đội ngũ bác sĩ chuyên khoa.",
      category: "checkup",
      price: "900.000đ",
      duration: "1 giờ",
      rating: 4.8,
      reviews: 167,
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      features: ["Đo thị lực", "Khám đáy mắt", "Đo nhãn áp", "Tư vấn kính"],
      doctor: "BS.CK1 Hoàng Văn Nam",
      location: "Khoa Mắt",
      available: true,
      featured: false
    },
    {
      id: 6,
      title: "Theo Dõi Sức Khỏe",
      description: "Theo dõi sức khỏe liên tục và các kế hoạch chăm sóc cá nhân hóa để giúp bạn duy trì sức khỏe tối ưu.",
      category: "monitoring",
      price: "990.000đ/tháng",
      duration: "Theo tháng",
      rating: 4.6,
      reviews: 278,
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      features: ["Giám sát từ xa", "Tư vấn online", "Báo cáo định kỳ", "Hỗ trợ 24/7"],
      doctor: "BS. Nguyễn Thị Mai",
      location: "Khoa Theo Dõi",
      available: true,
      featured: false
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

  useEffect(() => {
    let filtered = services;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase())) ||
        service.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const formatPrice = (price: string) => {
    return price.includes("đ") ? price : `${price}đ`;
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="fixed z-50 w-full">
          <Header />
        </div>

        {/* Hero Section - Medical Style */}
        <section className="relative w-full h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003875]">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross)" />
            </svg>
          </div>

          {/* Decorative Medical Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating medical icons */}
            <div className="absolute flex items-center justify-center w-16 h-16 rounded-full top-20 right-20 bg-white/10 animate-pulse">
              <HeartIcon className="w-8 h-8 text-white/60" />
            </div>
            <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bottom-32 right-32 bg-white/10 animate-bounce" style={{animationDelay: '1s'}}>
              <StethoscopeIcon className="w-6 h-6 text-white/60" />
            </div>
            <div className="absolute flex items-center justify-center rounded-full top-32 left-32 w-14 h-14 bg-white/10 animate-pulse" style={{animationDelay: '2s'}}>
              <ShieldIcon className="w-7 h-7 text-white/60" />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex items-center h-full">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
              <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
                
                {/* Left Content */}
                <div className={`transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}>
                  {/* Breadcrumb */}
                  <div className="mb-6">
                    <Breadcrumb>
                      <BreadcrumbList className="text-white/90">
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/" className="transition-colors duration-200 text-white/80 hover:text-white">
                            Trang Chủ
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-white/60" />
                        <BreadcrumbItem>
                          <span className="text-[#00D4FF] font-semibold">Dịch Vụ Y Tế</span>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>

                  {/* Title */}
                  <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                    Dịch Vụ Y Tế
                    <span className="block text-[#00D4FF] text-2xl md:text-3xl lg:text-4xl font-medium mt-1">
                      Chất Lượng Cao
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="max-w-lg mb-6 text-base leading-relaxed md:text-lg text-white/90">
                    Cung cấp dịch vụ chăm sóc sức khỏe toàn diện với đội ngũ chuyên gia y tế hàng đầu và công nghệ hiện đại nhất.
                  </p>

                  {/* CTA Buttons */}
                  
                </div>

                {/* Right Content - Service Preview Cards */}
              
              </div>
            </div>
          </div>


        </section>

        {/* Search and Filter Section - Medical Style */}
        <section className="py-8 bg-white">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            
            {/* Section Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center bg-[#E8F4FD] px-4 py-2 rounded-full mb-4">
                <SearchIcon className="w-4 h-4 text-[#0066CC] mr-2" />
                <span className="text-[#0066CC] font-medium text-sm">TÌM KIẾM DỊCH VỤ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#003875] mb-4">
                Tìm Dịch Vụ Phù Hợp
              </h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Khám phá các dịch vụ y tế chuyên nghiệp được thiết kế để đáp ứng nhu cầu chăm sóc sức khỏe của bạn
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066CC]/5 to-[#00D4FF]/5 rounded-2xl blur-xl"></div>
                <div className="relative p-2 bg-white border border-gray-200 shadow-xl rounded-2xl">
                  <div className="flex items-center">
                    <SearchIcon className="absolute left-6 text-[#0066CC] w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm dịch vụ, bác sĩ, chuyên khoa..."
                      className="w-full py-4 pl-16 pr-6 text-lg text-gray-800 placeholder-gray-500 bg-transparent border-0 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#003875] !text-white px-8 py-3 rounded-xl font-semibold shadow-md">
                      Tìm Kiếm
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Category Filter */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 border-2 hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-br from-[#0066CC] to-[#0052A3] border-[#0066CC] !text-white shadow-xl'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[#0066CC] hover:shadow-lg'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Icon Container */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-[#E8F4FD] to-[#B3D9F2] group-hover:from-[#0066CC]/10 group-hover:to-[#0066CC]/20'
                  }`}>
                    <div className={`${selectedCategory === category.id ? 'text-white' : 'text-[#0066CC]'}`}>
                      {category.icon}
                    </div>
                  </div>

                  {/* Category Name */}
                  <span className="mb-2 text-sm font-semibold text-center">
                    {category.name}
                  </span>

                  {/* Count Badge */}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E8F4FD] text-[#0066CC] group-hover:bg-[#0066CC]/10'
                  }`}>
                    {category.count} dịch vụ
                  </span>

                  {/* Selection Indicator */}
                  {selectedCategory === category.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00D4FF] rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#003875]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

                {/* All Services Section */}
        <section className="py-20 bg-blue-50">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            
            {/* Section Header */}
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003875] mb-6">
                Danh Sách Dịch Vụ Y Tế
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                Tìm thấy <span className="font-semibold text-[#0066CC]">{filteredServices.length}</span> dịch vụ
                {selectedCategory !== "all" && (
                  <span> trong danh mục <span className="font-semibold text-[#0066CC]">{getCategoryName(selectedCategory)}</span></span>
                )}
              </p>
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => (
                <Card key={service.id} className="relative overflow-hidden transition-all duration-500 bg-white border border-gray-200 group hover:shadow-2xl hover:-translate-y-3 rounded-3xl">
                  
                  <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003875]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-[#003875] mb-3 group-hover:text-[#0066CC] transition-colors duration-300 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-[#E8F4FD] rounded-full flex items-center justify-center mr-3">
                        <StethoscopeIcon className="w-5 h-5 text-[#0066CC]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#003875]">{service.doctor}</p>
                        <p className="text-xs text-gray-500">{service.location}</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1 text-[#0066CC]" />
                          {service.duration}
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {service.rating}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-[#0066CC]">
                        {formatPrice(service.price)}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button onClick={() => handleClick(service.id)} className="w-full bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#003875] !text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      Xem Chi Tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredServices.length === 0 && (
              <div className="py-16 text-center">
                <StethoscopeIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-600">Không tìm thấy dịch vụ</h3>
                <p className="mb-6 text-gray-500">Vui lòng thử lại với từ khóa khác hoặc thay đổi bộ lọc</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className="bg-[#0066CC] hover:bg-[#0052A3] text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Đặt Lại Bộ Lọc
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Main Content - 2 Column Layout */}
                {/* Why Choose Our Services */}
        <section className="py-16 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Tại Sao Chọn Dịch Vụ Của Chúng Tôi?
              </h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-slate-600">
                Chúng tôi cam kết mang lại chất lượng chăm sóc sức khỏe tốt nhất với công nghệ hiện đại
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <AwardIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Chất Lượng Cao</h3>
                <p className="text-slate-600">Dịch vụ y tế chất lượng cao với đội ngũ chuyên gia giàu kinh nghiệm</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <ClockIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Phục Vụ 24/7</h3>
                <p className="text-slate-600">Sẵn sàng phục vụ bạn mọi lúc với dịch vụ cấp cứu và tư vấn 24/7</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <ActivityIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Công Nghệ Tiên Tiến</h3>
                <p className="text-slate-600">Sử dụng thiết bị y tế hiện đại nhất cho chẩn đoán và điều trị</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <CheckCircleIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Uy Tín Đáng Tin</h3>
                <p className="text-slate-600">Được tin tưởng bởi hàng nghìn bệnh nhân với tỷ lệ hài lòng cao</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="container max-w-4xl px-4 mx-auto text-center md:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Sẵn Sàng Đặt Lịch Dịch Vụ?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-white/90">
              Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch sử dụng dịch vụ phù hợp
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button className="px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-50 hover:text-blue-900">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Đặt Lịch Ngay
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg text-white border-white rounded-full hover:bg-white hover:text-blue-900">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Hotline: 1900-xxxx
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
