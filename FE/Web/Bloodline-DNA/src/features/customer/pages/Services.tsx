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
import { useBookingModal } from "../components/BookingModalContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { servicesApi, getServiceById, type TestService, type ServiceDetail } from "../api/servicesApi";

// UI Interface for displaying services
interface Service {
  id: string;
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
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

// ===== HELPER FUNCTIONS =====
const categoryMappings: { [key: string]: string } = {
  'Civil': 'diagnostic',
  'Legal': 'consultation', 
  'Emergency': 'emergency',
  'Consultation': 'consultation',
  'Checkup': 'checkup',
  'Monitoring': 'monitoring'
};

const categoryDurations: { [key: string]: string } = {
  'Civil': '45-60 phút',
  'Legal': '1-2 giờ',
  'Emergency': '24/7',
  'Consultation': '30-45 phút',
  'Checkup': '1-2 giờ',
  'Monitoring': 'Theo tháng'
};

const categoryImages: { [key: string]: string } = {
  'Civil': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Legal': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Emergency': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Consultation': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Checkup': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Monitoring': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg'
};

const categoryFeatures: { [key: string]: string[] } = {
  'Civil': ['Xét nghiệm máu', 'Siêu âm', 'Chẩn đoán', 'Tư vấn'],
  'Legal': ['Xét nghiệm ADN', 'Phân tích mẫu tóc', 'Báo cáo pháp lý', 'Tư vấn chuyên môn'],
  'Emergency': ['Xe cấp cứu', 'Hồi sức cấp cứu', 'Phẫu thuật khẩn cấp', 'Chăm sóc đặc biệt'],
  'Consultation': ['Tư vấn chuyên sâu', 'Khám lâm sàng', 'Đưa ra phác đồ', 'Theo dõi điều trị'],
  'Checkup': ['Khám tổng quát', 'Xét nghiệm cơ bản', 'Siêu âm', 'Tư vấn sức khỏe'],
  'Monitoring': ['Theo dõi từ xa', 'Báo cáo định kỳ', 'Tư vấn online', 'Hỗ trợ 24/7']
};

const categoryDoctors: { [key: string]: string } = {
  'Civil': 'BS. Nguyễn Văn A',
  'Legal': 'BS.CK1 Phan Thị C',
  'Emergency': 'BS.CK2 Trần Thị B', 
  'Consultation': 'BS.CK1 Lê Văn C',
  'Checkup': 'BS. Phạm Thị D',
  'Monitoring': 'BS. Hoàng Văn E'
};

const categoryLocations: { [key: string]: string } = {
  'Civil': 'Khoa Xét nghiệm',
  'Legal': 'Phòng ADN - Pháp y',
  'Emergency': 'Khoa Cấp cứu',
  'Consultation': 'Phòng Tư vấn',
  'Checkup': 'Khoa Khám bệnh',
  'Monitoring': 'Khoa Theo dõi'
};

// Transform API data to UI format
const transformAPIDataToUIFormat = (apiServices: TestService[]): Service[] => {
  console.log('🔄 Transforming API data to UI format...');
  
  if (!Array.isArray(apiServices)) {
    console.warn('⚠️ API services is not an array, using empty array');
    return [];
  }
  
  return apiServices.map((apiService, index) => {
    console.log(`🔄 Processing service ${index + 1}:`, apiService);
    
    const serviceInfo = apiService.testServiceInfor;
    const title = serviceInfo?.name || `Service ${apiService.id}`;
    const description = serviceInfo?.description || 'Không có mô tả';
    const category = serviceInfo?.category || 'diagnostic';
    const isActive = apiService.isActive;
    
    return {
      id: apiService.id,
      title: title,
      description: description,
      category: categoryMappings[category] || 'diagnostic',
      price: `${apiService.price.toLocaleString('vi-VN')}đ`,
      duration: categoryDurations[category] || '30-60 phút',
      rating: 4.7 + Math.random() * 0.3,
      reviews: Math.floor(Math.random() * 300) + 50,
      image: categoryImages[category] || categoryImages['Civil'],
      features: categoryFeatures[category] || ['Dịch vụ chất lượng cao', 'Đội ngũ chuyên nghiệp'],
      doctor: categoryDoctors[category] || 'BS. Chuyên khoa',
      location: categoryLocations[category] || 'Phòng khám',
      available: isActive,
      featured: apiService.price > 1000000,
      isActive: isActive,
      effectiveFrom: apiService.effectiveFrom,
      effectiveTo: apiService.effectiveTo
    };
  });
};

// Mock data for fallback
const getMockServices = (): TestService[] => {
  return [
    {
      id: "mock-1",
      serviceId: "mock-service-1",
      price: 500000,
      collectionMethod: 0,
      currency: "VND",
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testServiceInfor: {
        id: "mock-1",
        name: "Xét nghiệm máu cơ bản",
        description: "Kiểm tra các chỉ số máu cơ bản",
        category: "Civil",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priceServices: []
      }
    },
    {
      id: "mock-2", 
      serviceId: "mock-service-2",
      price: 2000000,
      collectionMethod: 0,
      currency: "VND",
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testServiceInfor: {
        id: "mock-2",
        name: "Xét nghiệm ADN pháp lý",
        description: "Lấy mẫu tóc để xét nghiệm ADN cho mục đích pháp lý",
        category: "Legal",
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priceServices: []
      }
    }
  ];
};

// ===== MAIN COMPONENT =====
export const Services = (): React.JSX.Element => {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  const { openBookingModal } = useBookingModal();
  const navigate = useNavigate();

  // Event Handlers
  const handleViewDetail = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setDetailLoading(id);
    
    try {
      const serviceDetail = await getServiceById(id);
      navigate(`/services/${id}`, {
        state: {
          serviceDetail,
          currentService: services.find(s => s.id === id)
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết dịch vụ';
      navigate(`/services/${id}`, {
        state: {
          error: errorMessage,
          currentService: services.find(s => s.id === id)
        }
      });
    } finally {
      setDetailLoading(null);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('🚀 Loading services...');
        setLoading(true);
        
        const apiResponse = await servicesApi();
        console.log('📦 API response:', apiResponse);
        
        // Handle different response structures
        let apiServices: TestService[] = [];
        if (apiResponse?.data && Array.isArray(apiResponse.data)) {
          apiServices = apiResponse.data;
        } else if (Array.isArray(apiResponse)) {
          apiServices = apiResponse;
        }
        
        const transformedServices = transformAPIDataToUIFormat(apiServices);
        setServices(transformedServices);
        setError(null);
        console.log('✅ Services loaded successfully!');
        
      } catch (err) {
        console.error('❌ Error loading services:', err);
        
        // Fallback to mock data
        const mockServices = getMockServices();
        const transformedServices = transformAPIDataToUIFormat(mockServices);
        setServices(transformedServices);
        
        // Set user-friendly error message
        let errorMessage = 'API không khả dụng, đang hiển thị dữ liệu mẫu.';
        if (err instanceof Error) {
          if (err.message.includes('401')) {
            errorMessage = 'Phiên đăng nhập đã hết hạn. Đang hiển thị dữ liệu mẫu.';
          } else if (err.message.includes('timeout')) {
            errorMessage = 'Kết nối quá chậm. Đang hiển thị dữ liệu mẫu.';
          }
        }
        setError(errorMessage);
        
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Update categories based on services
  const categories: ServiceCategory[] = [
    {
      id: "all",
      name: "Tất Cả",
      icon: <StethoscopeIcon className="w-5 h-5" />,
      count: services.length
    },
    {
      id: "emergency",
      name: "Cấp Cứu",
      icon: <HeartIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'emergency').length
    },
    {
      id: "checkup",
      name: "Khám Định Kỳ",
      icon: <ShieldIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'checkup').length
    },
    {
      id: "consultation",
      name: "Tư Vấn",
      icon: <ActivityIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'consultation').length
    },
    {
      id: "diagnostic",
      name: "Chẩn Đoán",
      icon: <ClipboardCheckIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'diagnostic').length
    },
    {
      id: "monitoring",
      name: "Theo Dõi",
      icon: <UserCheckIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'monitoring').length
    }
  ];

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter services
  useEffect(() => {
    let filtered = services;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase())) ||
        service.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, services]);

  // Helper functions
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const formatPrice = (price: string) => {
    if (price.includes("đ")) return price;
    const numericPrice = parseFloat(price.replace(/[^\d]/g, ''));
    return !isNaN(numericPrice) ? `${numericPrice.toLocaleString('vi-VN')}đ` : `${price}đ`;
  };

  // ===== RENDER FUNCTIONS =====
  
  // Loading State
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Đang tải danh sách dịch vụ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && services.length === 0) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <ClipboardCheckIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="fixed z-50 w-full">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-20 bg-blue-50 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="#1e40af"/>
                  <rect x="4" y="8" width="12" height="4" fill="#1e40af"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross)" />
            </svg>
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute flex items-center justify-center w-16 h-16 rounded-full top-20 right-20 bg-blue-200/30 animate-pulse">
              <HeartIcon className="w-8 h-8 text-blue-600/60" />
            </div>
            <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bottom-32 right-32 bg-blue-200/30 animate-bounce" style={{animationDelay: '1s'}}>
              <StethoscopeIcon className="w-6 h-6 text-blue-600/60" />
            </div>
            <div className="absolute flex items-center justify-center rounded-full top-32 left-32 w-14 h-14 bg-blue-200/30 animate-pulse" style={{animationDelay: '2s'}}>
              <ShieldIcon className="w-7 h-7 text-blue-600/60" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center h-full">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
              <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
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
                          <span className="text-blue-900 font-semibold">Dịch Vụ Y Tế</span>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>

                  {/* Title */}
                  <h1 className="mb-4 text-3xl font-bold leading-tight text-blue-900 md:text-4xl lg:text-5xl">
                    Dịch Vụ Y Tế
                    <span className="block text-blue-700 text-2xl md:text-3xl lg:text-4xl font-medium mt-1">
                      Chất Lượng Cao
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="max-w-lg mb-6 text-base leading-relaxed md:text-lg text-blue-700">
                    Cung cấp dịch vụ chăm sóc sức khỏe toàn diện với đội ngũ chuyên gia y tế hàng đầu và công nghệ hiện đại nhất.
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-200">
                      <span className="text-2xl font-bold text-blue-900">{services.length}</span>
                      <span className="block text-sm text-blue-600">Dịch vụ</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-200">
                      <span className="text-2xl font-bold text-blue-900">{services.filter(s => s.isActive).length}</span>
                      <span className="block text-sm text-blue-600">Đang hoạt động</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
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

            {/* Search Bar */}
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

            {/* Category Filter */}
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
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-[#E8F4FD] to-[#B3D9F2] group-hover:from-[#0066CC]/10 group-hover:to-[#0066CC]/20'
                  }`}>
                    <div className={`${selectedCategory === category.id ? 'text-white' : 'text-[#0066CC]'}`}>
                      {category.icon}
                    </div>
                  </div>

                  {/* Name */}
                  <span className="mb-2 text-sm font-semibold text-center">
                    {category.name}
                  </span>

                  {/* Count */}
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

        {/* Services List Section */}
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

            {/* Error Warning */}
            {error && (
              <div className="mb-8 p-4 bg-orange-100 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-3 text-orange-600">⚠️</div>
                  <div>
                    <p className="font-medium text-orange-800">{error}</p>
                    <p className="text-sm text-orange-600">Vui lòng kiểm tra kết nối mạng.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((service, index) => (
                  <Card 
                    key={service.id} 
                    className="relative overflow-hidden transition-all duration-300 bg-white border shadow-md group hover:shadow-xl hover:-translate-y-2 rounded-2xl"
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC]/5 via-[#00D4FF]/5 to-[#0052A3]/5"></div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm transition-all duration-300 bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                        ✓ Đang hoạt động
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {service.featured && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                          ⭐ Nổi bật
                        </span>
                      </div>
                    )}
                    
                    {/* Image */}
                    <div className="relative overflow-hidden h-60 rounded-t-2xl">
                      <img 
                        src={service.image}
                        alt={service.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Hover Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-white">{service.doctor}</span>
                          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">{service.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      {/* Title & Description */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                          <span className="font-semibold">{service.rating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">({service.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <hr className="my-4 border-gray-100" />

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(service.price)}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={(e) => handleViewDetail(e, service.id)} 
                        disabled={detailLoading === service.id}
                        className="w-full font-semibold transition-all duration-300 transform rounded-lg shadow-md bg-slate-800 hover:bg-slate-900 !text-white hover:shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {detailLoading === service.id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang tải...
                          </div>
                        ) : (
                          'Xem Chi Tiết'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="py-20 text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
                    <StethoscopeIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#0066CC] to-[#0052A3] rounded-full flex items-center justify-center">
                    <SearchIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h3 className="mb-4 text-2xl font-bold text-gray-700">Không tìm thấy dịch vụ phù hợp</h3>
                <p className="mb-8 text-gray-500 max-w-md mx-auto leading-relaxed">
                  Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc để khám phá các dịch vụ y tế của chúng tôi
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    onClick={handleResetFilters}
                    className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#003875] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    🔄 Đặt Lại Bộ Lọc
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-2 border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC] hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    Xóa Từ Khóa Tìm Kiếm
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
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

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
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
              <Button
                onClick={openBookingModal}
                className="px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-50 hover:text-blue-900"
              >
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
        <Footer />
      </div>
    </div>
  );
};
