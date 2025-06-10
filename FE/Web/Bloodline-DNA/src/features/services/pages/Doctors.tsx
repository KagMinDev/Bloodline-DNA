import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRightIcon, 
  StarIcon, 
  PhoneIcon, 
  CalendarIcon,
  MapPinIcon,
  GraduationCapIcon,
  UserIcon,
  FilterIcon,
  SearchIcon,
  CheckCircleIcon,
  ClockIcon,
  AwardIcon,
  StethoscopeIcon,
  HeartIcon,
  EyeIcon,
  BrainIcon,
  BabyIcon,
  ActivityIcon
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

interface Doctor {
  id: number;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  education: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  about: string;
  languages: string[];
  availableHours: string;
  services: string[];
  featured: boolean;
}

interface Specialization {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

export const Doctors = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const specializations: Specialization[] = [
    {
      id: "all",
      name: "Tất Cả",
      icon: <UserIcon className="w-5 h-5" />,
      count: 12
    },
    {
      id: "cardiology",
      name: "Tim Mạch",
      icon: <HeartIcon className="w-5 h-5" />,
      count: 3
    },
    {
      id: "ophthalmology", 
      name: "Mắt",
      icon: <EyeIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "neurology",
      name: "Thần Kinh",
      icon: <BrainIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "pediatrics",
      name: "Nhi Khoa",
      icon: <BabyIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "general",
      name: "Đa Khoa",
      icon: <StethoscopeIcon className="w-5 h-5" />,
      count: 3
    }
  ];

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "BS.CK2 Nguyễn Văn An",
      title: "Tiến sĩ, Bác sĩ Chuyên khoa II",
      specialization: "cardiology",
      experience: "15 năm kinh nghiệm",
      education: "Đại học Y Hà Nội, Chuyên tu tại Mỹ",
      location: "Bệnh viện Đa khoa Quốc tế",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.9,
      reviews: 234,
      price: "500.000đ",
      about: "Chuyên gia hàng đầu về tim mạch với hơn 15 năm kinh nghiệm điều trị các bệnh lý tim mạch phức tạp.",
      languages: ["Tiếng Việt", "English"],
      availableHours: "8:00 - 17:00",
      services: ["Khám tim mạch", "Siêu âm tim", "Điện tâm đồ", "Can thiệp mạch vành"],
      featured: true
    },
    {
      id: 2,
      name: "BS.CK1 Trần Thị Bình",
      title: "Bác sĩ Chuyên khoa I",
      specialization: "ophthalmology",
      experience: "12 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM",
      location: "Phòng khám Chuyên khoa Mắt",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.8,
      reviews: 189,
      price: "400.000đ",
      about: "Bác sĩ chuyên khoa mắt với kinh nghiệm phong phú trong điều trị các bệnh lý về mắt.",
      languages: ["Tiếng Việt"],
      availableHours: "8:00 - 16:30",
      services: ["Khám mắt tổng quát", "Phẫu thuật cận thị", "Điều trị đục thủy tinh thể"],
      featured: false
    },
    {
      id: 3,
      name: "BS.CK2 Lê Minh Đức",
      title: "Tiến sĩ, Bác sĩ Chuyên khoa II",
      specialization: "neurology",
      experience: "18 năm kinh nghiệm",
      education: "Đại học Y Hà Nội, Thạc sĩ tại Nhật",
      location: "Trung tâm Thần kinh",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.9,
      reviews: 312,
      price: "600.000đ",
      about: "Chuyên gia thần kinh hàng đầu với nhiều công trình nghiên cứu được công nhận quốc tế.",
      languages: ["Tiếng Việt", "English", "日本語"],
      availableHours: "9:00 - 17:00",
      services: ["Khám thần kinh", "Điều trị đau đầu", "Chẩn đoán động kinh", "Tư vấn tâm lý"],
      featured: true
    },
    {
      id: 4,
      name: "BS. Phạm Thu Hằng",
      title: "Bác sĩ Chuyên khoa I",
      specialization: "pediatrics",
      experience: "10 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM",
      location: "Bệnh viện Nhi đồng",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.7,
      reviews: 156,
      price: "350.000đ",
      about: "Bác sĩ nhi khoa tận tâm, chuyên điều trị các bệnh lý ở trẻ em từ sơ sinh đến 16 tuổi.",
      languages: ["Tiếng Việt", "English"],
      availableHours: "8:00 - 17:00",
      services: ["Khám nhi tổng quát", "Tiêm chủng", "Dinh dưỡng trẻ em", "Tư vấn phát triển"],
      featured: false
    },
    {
      id: 5,
      name: "BS.CK1 Hoàng Văn Tuấn",
      title: "Bác sĩ Chuyên khoa I",
      specialization: "general",
      experience: "14 năm kinh nghiệm",
      education: "Đại học Y Hà Nội",
      location: "Bệnh viện Đa khoa Trung ương",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.6,
      reviews: 198,
      price: "300.000đ",
      about: "Bác sĩ đa khoa giàu kinh nghiệm, chuyên khám và điều trị các bệnh lý nội khoa thường gặp.",
      languages: ["Tiếng Việt"],
      availableHours: "7:30 - 16:00",
      services: ["Khám nội tổng quát", "Điều trị tiểu đường", "Cao huyết áp", "Tư vấn sức khỏe"],
      featured: false
    },
    {
      id: 6,
      name: "BS.CK2 Nguyễn Thị Mai",
      title: "Tiến sĩ, Bác sĩ Chuyên khoa II",
      specialization: "cardiology",
      experience: "16 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM, PhD tại Úc",
      location: "Bệnh viện Tim Hà Nội",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.8,
      reviews: 267,
      price: "550.000đ",
      about: "Chuyên gia tim mạch nữ hàng đầu, đặc biệt trong lĩnh vực tim mạch can thiệp.",
      languages: ["Tiếng Việt", "English"],
      availableHours: "8:30 - 17:30",
      services: ["Khám tim mạch nữ", "Phẫu thuật tim", "Can thiệp mạch", "Tư vấn tim thai"],
      featured: true
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
    let filtered = doctors;
    
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredDoctors(filtered);
  }, [selectedSpecialization, searchTerm]);

  const getSpecializationName = (spec: string) => {
    const specialization = specializations.find(s => s.id === spec);
    return specialization ? specialization.name : spec;
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section - Medical Style */}
        <section className="relative w-full h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003875]">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-doctors" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-doctors)" />
            </svg>
          </div>

          {/* Decorative Medical Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating medical icons */}
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
              <StethoscopeIcon className="w-8 h-8 text-white/60" />
            </div>
            <div className="absolute bottom-32 right-32 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
              <UserIcon className="w-6 h-6 text-white/60" />
            </div>
            <div className="absolute top-32 left-32 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
              <AwardIcon className="w-7 h-7 text-white/60" />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              <div className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                {/* Breadcrumb */}
                <div className="mb-6">
                  <Breadcrumb>
                    <BreadcrumbList className="text-white/90">
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="text-white/80 hover:text-white transition-colors duration-200">
                          Trang Chủ
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-white/60" />
                      <BreadcrumbItem>
                        <span className="text-[#00D4FF] font-semibold">Đội Ngũ Bác Sĩ</span>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  Đội Ngũ Bác Sĩ
                  <span className="block text-[#00D4FF] text-2xl md:text-3xl lg:text-4xl font-medium mt-1">
                    Chuyên Gia Hàng Đầu
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6 max-w-lg">
                  Gặp gỡ các chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm và trình độ chuyên môn cao.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 md:py-16 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {specializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialization(spec.id)}
                  className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-300 text-sm md:text-base font-medium ${
                    selectedSpecialization === spec.id
                      ? 'bg-blue-900 !text-white shadow-lg'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  {spec.icon}
                  <span className="ml-2">{spec.name}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedSpecialization === spec.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {spec.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16 md:py-20 lg:py-24 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            {/* Results Info */}
            <div className="mb-8">
              <p className="text-lg text-slate-600">
                Tìm thấy <span className="font-semibold text-blue-900">{filteredDoctors.length}</span> bác sĩ
                {selectedSpecialization !== "all" && (
                  <span> trong chuyên khoa <span className="font-semibold text-blue-900">{getSpecializationName(selectedSpecialization)}</span></span>
                )}
              </p>
            </div>

            {/* Featured Doctors */}
            {filteredDoctors.some(doctor => doctor.featured) && (
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">Bác Sĩ Nổi Bật</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredDoctors.filter(doctor => doctor.featured).map((doctor) => (
                    <Card key={doctor.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 relative">
                      {/* Featured Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold z-10">
                        ⭐ Nổi Bật
                      </div>
                      
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-blue-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                            {doctor.name}
                          </h3>
                          <p className="text-blue-600 font-semibold text-sm mb-1">{doctor.title}</p>
                          <p className="text-blue-600 font-medium">{getSpecializationName(doctor.specialization)}</p>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center text-slate-600">
                            <GraduationCapIcon className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.experience}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.location}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.availableHours}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold text-gray-800">{doctor.rating}</span>
                            <span className="ml-1 text-slate-500 text-sm">({doctor.reviews})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-blue-900">{doctor.price}</span>
                            <p className="text-xs text-slate-500">/ lần khám</p>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {doctor.about}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:!text-white text-sm py-2">
                            Xem Chi Tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Doctors */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">
                {filteredDoctors.some(doctor => doctor.featured) ? "Tất Cả Bác Sĩ" : "Danh Sách Bác Sĩ"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {doctor.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                          ⭐
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-blue-900 mb-1 group-hover:text-blue-700 transition-colors duration-300 line-clamp-1">
                          {doctor.name}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">{getSpecializationName(doctor.specialization)}</p>
                      </div>

                      <div className="space-y-1 mb-3 text-xs">
                        <div className="flex items-center text-slate-600">
                          <GraduationCapIcon className="w-3 h-3 mr-1 text-blue-500" />
                          {doctor.experience}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <ClockIcon className="w-3 h-3 mr-1 text-blue-500" />
                          {doctor.availableHours}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-semibold text-gray-800 text-sm">{doctor.rating}</span>
                        </div>
                        <span className="text-sm font-bold text-blue-900">{doctor.price}</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:!text-white text-sm py-2">
                            Xem Chi Tiết
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredDoctors.length === 0 && (
                <div className="text-center py-16">
                  <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">Không tìm thấy bác sĩ</h3>
                  <p className="text-slate-500">Vui lòng thử lại với từ khóa khác hoặc thay đổi bộ lọc</p>
                  <Button 
                    onClick={() => {
                      setSelectedSpecialization("all");
                      setSearchTerm("");
                    }}
                    className="mt-4 bg-blue-900 hover:bg-blue-800 !text-white"
                  >
                    Đặt Lại Bộ Lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Our Doctors */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                Tại Sao Chọn Bác Sĩ Của Chúng Tôi?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Đội ngũ bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm và được đào tạo bài bản
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <AwardIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Chuyên Gia Hàng Đầu</h3>
                <p className="text-slate-600">Các bác sĩ được đào tạo tại những trường đại học y khoa uy tín</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <HeartIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Tận Tâm Chăm Sóc</h3>
                <p className="text-slate-600">Luôn đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <ActivityIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Công Nghệ Hiện Đại</h3>
                <p className="text-slate-600">Sử dụng trang thiết bị y tế tiên tiến nhất cho chẩn đoán chính xác</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <CheckCircleIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Kinh Nghiệm Phong Phú</h3>
                <p className="text-slate-600">Nhiều năm kinh nghiệm điều trị thành công hàng nghìn ca bệnh</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Sẵn Sàng Đặt Lịch Khám?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch khám với bác sĩ phù hợp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-900 px-8 py-4 rounded-full text-lg font-semibold">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Đặt Lịch Khám
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