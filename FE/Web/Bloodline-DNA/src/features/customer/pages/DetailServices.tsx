import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BriefcaseMedicalIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  HeartIcon,
  InfoIcon,
  ShieldIcon,
  StarIcon,
  StethoscopeIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Footer, Header } from "../../../components";
import { type ServiceDetail, getServiceById } from "../api/servicesApi";
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

// ===== INTERFACES =====
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

// ===== HELPER FUNCTIONS =====
const categoryMapping: { [key: string]: string } = {
  'Civil': 'Dịch Vụ Dân Sự',
  'Legal': 'Dịch Vụ Pháp Lý',
  'Emergency': 'Dịch Vụ Cấp Cứu',
  'Consultation': 'Dịch Vụ Tư Vấn',
  'Checkup': 'Khám Sức Khỏe',
  'Monitoring': 'Theo Dõi Sức Khỏe'
};

const durationMapping: { [key: string]: string } = {
  'Civil': '45-60 phút',
  'Legal': '1-2 giờ',
  'Emergency': '24/7',
  'Consultation': '30-45 phút',
  'Checkup': '1-2 giờ',
  'Monitoring': 'Theo tháng'
};

const getCategoryInVietnamese = (category: string): string => {
  return categoryMapping[category] || category;
};

const getDurationByCategory = (category: string): string => {
  return durationMapping[category] || '30-60 phút';
};

// ===== STATIC DATA =====
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

const doctors: Doctor[] = [
  {
    id: 1, name: "BS.CK1 Nguyễn Văn An", specialization: "Nội Tim Mạch", experience: "15 năm kinh nghiệm",
    image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png", rating: 4.9, reviews: 234
  },
  {
    id: 2, name: "BS.CK2 Trần Thị Bình", specialization: "Nội Tiết", experience: "12 năm kinh nghiệm",
    image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png", rating: 4.8, reviews: 189
  },
  {
    id: 3, name: "BS.CK1 Lê Minh Đức", specialization: "Chẩn Đoán Hình Ảnh", experience: "18 năm kinh nghiệm",
    image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png", rating: 4.9, reviews: 312
  }
];

const faqs: FAQ[] = [
  { question: "Tôi cần chuẩn bị gì trước khi khám?", answer: "Bạn nên nhịn ăn 8-10 tiếng trước khi khám để đảm bảo kết quả xét nghiệm chính xác. Mang theo các kết quả khám trước đó (nếu có) và danh sách thuốc đang sử dụng." },
  { question: "Khám sức khỏe định kỳ mất bao lâu?", answer: "Tùy vào gói khám bạn chọn, thời gian có thể từ 2-6 giờ. Gói cơ bản khoảng 2 giờ, gói nâng cao 3-4 giờ, và gói VIP có thể mất cả ngày." },
  { question: "Khi nào tôi nhận được kết quả?", answer: "Hầu hết kết quả sẽ có ngay trong ngày khám. Một số xét nghiệm chuyên sâu có thể cần 1-2 ngày. Chúng tôi sẽ gọi điện thông báo khi có kết quả đầy đủ." },
  { question: "Có bảo hiểm y tế được không?", answer: "Chúng tôi chấp nhận hầu hết các loại bảo hiểm y tế. Vui lòng liên hệ trước để xác nhận và biết chi tiết về mức hỗ trợ của bảo hiểm." }
];

const relatedServices: RelatedService[] = [
  { id: 1, title: "Khám Tim Mạch", price: "2.500.000đ", image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png", description: "Khám và tầm soát các bệnh lý tim mạch" },
  { id: 2, title: "Xét Nghiệm Tổng Quát", price: "1.200.000đ", image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png", description: "Xét nghiệm máu, nước tiểu toàn diện" },
  { id: 3, title: "Siêu Âm 4D", price: "800.000đ", image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png", description: "Siêu âm chẩn đoán hình ảnh chất lượng cao" }
];

// ===== MAIN COMPONENT =====
export const DetailServices = (): React.JSX.Element => {
  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);

  const { openBookingModal } = useBookingModal();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from navigation state
  const passedServiceDetail = location.state?.serviceDetail;
  const passedCurrentService = location.state?.currentService;
  const passedError = location.state?.error;

  // Prepare service data for display
  const serviceData = serviceDetail ? {
    title: serviceDetail.name,
    subtitle: getCategoryInVietnamese(serviceDetail.category),
    heroImage: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
    category: getCategoryInVietnamese(serviceDetail.category),
    duration: getDurationByCategory(serviceDetail.category),
    description: serviceDetail.description || "Dịch vụ chăm sóc sức khỏe chuyên nghiệp với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm và trang thiết bị y tế hiện đại.",
    overview: `Dịch vụ ${serviceDetail.name} được thiết kế để đáp ứng nhu cầu chăm sóc sức khỏe của bạn với chất lượng cao nhất. Chúng tôi cam kết mang lại trải nghiệm tốt nhất cho khách hàng.`,
    isActive: serviceDetail.isActive,
    sampleCount: serviceDetail.sampleCount,
    priceServices: serviceDetail.priceServices
  } : passedCurrentService ? {
    title: passedCurrentService.title,
    subtitle: passedCurrentService.category,
    heroImage: passedCurrentService.image,
    category: passedCurrentService.category,
    duration: passedCurrentService.duration,
    description: passedCurrentService.description,
    overview: `Dịch vụ ${passedCurrentService.title} được thiết kế để đáp ứng nhu cầu chăm sóc sức khỏe của bạn với chất lượng cao nhất.`,
    isActive: passedCurrentService.isActive,
    sampleCount: 0,
    priceServices: []
  } : null;

  // Generate pricing packages from service data
  const pricingPackages = serviceData?.priceServices && serviceData.priceServices.length > 0 
    ? serviceData.priceServices.map((priceService, index) => ({
        name: `${serviceData.title} - Gói ${index + 1}`,
        price: priceService.price.toLocaleString('vi-VN'),
        duration: getDurationByCategory(serviceDetail?.category || 'Civil'),
        features: [
          `Dịch vụ: ${serviceData.title}`,
          `Phương thức: ${priceService.collectionMethod === 0 ? 'Tại phòng khám' : 'Tại nhà'}`,
          `Hiệu lực: ${new Date(priceService.effectiveFrom).toLocaleDateString('vi-VN')} - ${new Date(priceService.effectiveTo).toLocaleDateString('vi-VN')}`,
          "Tư vấn chuyên môn",
          "Báo cáo kết quả chi tiết"
        ],
        isActive: priceService.isActive,
        popular: index === 0 && priceService.isActive
      }))
    : serviceData ? [
        {
          name: `${serviceData.title} - Gói Tiêu Chuẩn`,
          price: "Liên hệ",
          duration: serviceData.duration,
          features: [
            `Dịch vụ: ${serviceData.title}`,
            "Tư vấn chuyên môn",
            "Thực hiện tại phòng khám",
            "Báo cáo kết quả chi tiết",
            "Hỗ trợ sau dịch vụ"
          ],
          isActive: serviceData.isActive,
          popular: true
        }
      ] : [];

  // Event handlers
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Load service data
  useEffect(() => {
    const loadServiceData = async () => {
      setLoading(true);
      try {
        if (passedServiceDetail) {
          setServiceDetail(passedServiceDetail);
          return;
        }
        if (passedError && !passedCurrentService) {
          setError(passedError);
          return;
        }
        if (id) {
          const detail = await getServiceById(id);
          setServiceDetail(detail);
          setError(null);
        } else if (!passedCurrentService) {
          throw new Error('Không tìm thấy ID dịch vụ');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin dịch vụ';
        setError(errorMessage);
        if (!passedCurrentService) setServiceDetail(null);
      } finally {
        setLoading(false);
      }
    };

    loadServiceData();
  }, [id, passedServiceDetail, passedError, passedCurrentService]);

  // ===== RENDER FUNCTIONS =====
  
  // Loading State
  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full">
        <Header />
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 80px)'}}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Đang tải thông tin dịch vụ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State (no fallback data)
  if (error && !serviceData) {
    return (
      <div className="bg-white min-h-screen w-full">
        <Header />
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 80px)'}}>
          <div className="text-center p-4">
            <div className="text-red-500 mb-4">
              <StethoscopeIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải thông tin dịch vụ</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/services')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Service not found
  if (!serviceData) {
    return (
        <div className="bg-white min-h-screen w-full">
            <Header />
            <div className="flex items-center justify-center" style={{height: 'calc(100vh - 80px)'}}>
                <div className="text-center p-4">
                    <div className="text-red-500 mb-4"><StethoscopeIcon className="w-16 h-16 mx-auto" /></div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy dịch vụ</h3>
                    <p className="text-gray-600 mb-4">Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Button onClick={() => navigate('/services')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Quay lại danh sách
                    </Button>
                </div>
            </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="prose max-w-none prose-lg text-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mô tả chi tiết</h3>
            <p>{serviceData.description}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tổng quan</h3>
            <p>{serviceData.overview}</p>
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tại Sao Chọn Chúng Tôi?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {serviceFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "pricing":
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gói Dịch Vụ & Bảng Giá</h3>
            <div className="space-y-6">
              {serviceData.priceServices.length > 0 ? (
                serviceData.priceServices.map((pkg, index) => (
                  <Card key={pkg.id} className={`transition-all duration-300 rounded-xl overflow-hidden ${!pkg.isActive ? "bg-gray-50" : "bg-white"}`}>
                    <CardContent className="p-6">
                      <div className="md:flex justify-between items-center">
                        <div className="flex-grow mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            <h4 className="text-xl font-bold text-gray-800 mr-3">{serviceData.title} - Gói {index + 1}</h4>
                            {!pkg.isActive && <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">Không hoạt động</span>}
                          </div>
                          <p className="text-sm text-gray-500">Phương pháp: {pkg.collectionMethod === 0 ? "Tại phòng khám" : "Tại nhà"}</p>
                          <p className="text-sm text-gray-500">Hiệu lực: {new Date(pkg.effectiveFrom).toLocaleDateString("vi-VN")} - {new Date(pkg.effectiveTo).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-bold text-blue-600 mb-2">{pkg.price.toLocaleString("vi-VN")}đ</p>
                          <Button onClick={openBookingModal} disabled={!pkg.isActive} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Đặt Lịch
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                  <InfoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bảng giá chi tiết</h4>
                  <p className="text-gray-500">Vui lòng liên hệ với chúng tôi để được tư vấn và báo giá.</p>
                </div>
              )}
            </div>
          </div>
        );
      case "faq":
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Câu Hỏi Thường Gặp</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden transition-colors duration-200 border border-blue-200 hover:border-blue-400">
                  <CardHeader className="p-6 transition-colors duration-200 cursor-pointer hover:bg-blue-50" onClick={() => toggleFAQ(index)}>
                    <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-blue-900">{faq.question}</h3>{openFAQ === index ? <ChevronUpIcon className="w-5 h-5 text-blue-600" /> : <ChevronDownIcon className="w-5 h-5 text-blue-600" />}</div>
                  </CardHeader>
                  {openFAQ === index && <CardContent className="px-6 pt-0 pb-6"><p className="leading-relaxed text-gray-700">{faq.answer}</p></CardContent>}
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        <Header />

        {error && (
          <section className="py-4 bg-orange-50 border-y-2 border-orange-200">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
              <div className="flex items-center p-4 rounded-lg bg-orange-100 border border-orange-200">
                <div className="mr-3 text-orange-600">⚠️</div>
                <div className="flex-1">
                  <p className="font-medium text-orange-800">{error}</p>
                  <p className="text-sm text-orange-600 mt-1">Đang hiển thị thông tin cơ bản. Một số chi tiết có thể không đầy đủ.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="relative w-full py-16 md:py-20 bg-blue-50 overflow-hidden">
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
          <div className="relative z-10 container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="/services" className="text-blue-600 hover:text-blue-800">Dịch Vụ</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><span className="font-semibold text-blue-900">{serviceData.title}</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-blue-900 md:text-4xl lg:text-5xl">{serviceData.title}
              <span className="block mt-1 text-2xl font-medium text-blue-700 md:text-3xl lg:text-4xl">{serviceData.subtitle}</span>
            </h1>
            <p className="max-w-lg mb-6 text-base leading-relaxed md:text-lg text-blue-700">{serviceData.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className={`px-4 py-2 rounded-lg border ${serviceData.isActive ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                <span className={`text-sm font-medium ${serviceData.isActive ? 'text-green-800' : 'text-red-800'}`}>{serviceData.isActive ? '✓ Đang hoạt động' : '✗ Không hoạt động'}</span>
              </div>
              <div className="px-4 py-2 border border-blue-200 rounded-lg bg-blue-100"><span className="text-sm font-medium text-blue-800">Thời gian: {serviceData.duration}</span></div>
              <div className="px-4 py-2 border border-purple-200 rounded-lg bg-purple-100"><span className="text-sm font-medium text-purple-800">Danh mục: {serviceData.category}</span></div>
              {serviceData.sampleCount > 0 && <div className="px-4 py-2 border border-orange-200 rounded-lg bg-orange-100"><span className="text-sm font-medium text-orange-800">Mẫu: {serviceData.sampleCount}</span></div>}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">Tổng Quan Dịch Vụ</h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">{serviceData.description}</p>
                <p className="mb-8 text-lg leading-relaxed text-gray-700">{serviceData.overview}</p>
                <Button className="!text-white bg-blue-900 hover:bg-blue-800 px-6 py-3 rounded-full transition-all duration-300">Tìm Hiểu Thêm <ArrowRightIcon className="w-5 h-5 ml-2" /></Button>
              </div>
              <div className="relative"><img src={serviceData.heroImage} alt="Service Overview" className="object-cover w-full h-96 lg:h-[500px] rounded-2xl shadow-2xl" /></div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-100 md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">Tại Sao Chọn Chúng Tôi?</h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-700">Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao với những ưu điểm vượt trội</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-center transition-all duration-300 bg-white border-0 group hover:shadow-xl hover:-translate-y-2"><CardContent className="p-0">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-transform duration-300 rounded-full bg-blue-50 group-hover:bg-blue-200 group-hover:scale-110">{feature.icon}</div>
                  <h3 className="mb-4 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">{feature.title}</h3>
                  <p className="leading-relaxed text-gray-700">{feature.description}</p>
                </CardContent></Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">Gói Dịch Vụ</h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700">Chọn gói phù hợp với nhu cầu và ngân sách của bạn</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {pricingPackages.map((pkg, index) => (
                <Card key={index} className={`relative flex flex-col h-full overflow-hidden transition-all duration-300 border hover:shadow-2xl hover:-translate-y-4 ${pkg.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border-blue-200'} ${!pkg.isActive ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={() => pkg.isActive && setSelectedPackage(index)}>
                  {pkg.popular && <div className="absolute top-0 left-0 right-0 z-10 py-2 text-sm font-semibold text-center text-white bg-blue-500">PHỔ BIẾN NHẤT</div>}
                  <CardHeader className={`text-center ${pkg.popular ? 'pt-12' : 'pt-6'} pb-6`}>
                    <h3 className="mb-2 text-2xl font-bold text-blue-900">{pkg.name}</h3>
                    <div className="mb-4"><span className="text-4xl font-bold text-blue-700">{pkg.price}</span><span className="ml-1 text-gray-700">{pkg.price !== "Liên hệ" && "VNĐ"}</span></div>
                    <p className="text-gray-700"><ClockIcon className="inline w-4 h-4 mr-1" />{pkg.duration}</p>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow px-6 pb-6">
                    <ul className="flex-grow mb-6 space-y-3">
                      {pkg.features.map((feature, idx) => (<li key={idx} className="flex items-center"><CheckCircleIcon className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" /><span className="text-gray-700">{feature}</span></li>))}
                    </ul>
                    <Button disabled={!pkg.isActive} onClick={openBookingModal} className={`w-full py-3 mt-auto font-semibold text-white transition-all duration-300 rounded-full ${!pkg.isActive ? 'bg-gray-400 cursor-not-allowed' : pkg.popular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-900 hover:bg-blue-800'}`}>{!pkg.isActive ? 'Không khả dụng' : 'Chọn Gói Này'}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-100 md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">Đội Ngũ Bác Sĩ</h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700">Các chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden transition-all duration-300 bg-white border-0 group hover:shadow-xl hover:-translate-y-2">
                  <div className="relative h-80 overflow-hidden"><img src={doctor.image} alt={doctor.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" /></div>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">{doctor.name}</h3>
                    <p className="mb-2 font-semibold text-blue-600">{doctor.specialization}</p>
                    <p className="mb-4 text-gray-700">{doctor.experience}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center"><StarIcon className="w-5 h-5 text-yellow-400 fill-current" /><span className="ml-1 font-semibold text-gray-900">{doctor.rating}</span><span className="ml-1 text-gray-600">({doctor.reviews} đánh giá)</span></div>
                      <Button variant="outline" size="sm" className="text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white">Xem Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">Câu Hỏi Thường Gặp</h2>
              <p className="text-lg leading-relaxed text-gray-700">Những thắc mắc phổ biến về dịch vụ khám sức khỏe</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden transition-colors duration-200 border border-blue-200 hover:border-blue-400">
                  <CardHeader className="p-6 transition-colors duration-200 cursor-pointer hover:bg-blue-50" onClick={() => toggleFAQ(index)}>
                    <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-blue-900">{faq.question}</h3>{openFAQ === index ? <ChevronUpIcon className="w-5 h-5 text-blue-600" /> : <ChevronDownIcon className="w-5 h-5 text-blue-600" />}</div>
                  </CardHeader>
                  {openFAQ === index && <CardContent className="px-6 pt-0 pb-6"><p className="leading-relaxed text-gray-700">{faq.answer}</p></CardContent>}
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-100 md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">Dịch Vụ Liên Quan</h2>
              <p className="text-lg leading-relaxed text-gray-700">Khám phá thêm các dịch vụ y tế khác</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedServices.map((service) => (
                <Card key={service.id} className="overflow-hidden transition-all duration-300 bg-white border-0 cursor-pointer group hover:shadow-xl hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden"><img src={service.image} alt={service.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" /></div>
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">{service.title}</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">{service.description}</p>
                    <Button variant="outline" className="w-full text-blue-900 border-blue-900 hover:bg-blue-900 hover:!text-white">Xem Chi Tiết <ArrowRightIcon className="w-4 h-4 ml-2" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="container max-w-4xl px-4 mx-auto text-center md:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">Sẵn Sàng Bắt Đầu Hành Trình Chăm Sóc Sức Khỏe?</h2>
            <p className="mb-8 text-xl text-white/90">Đặt lịch khám ngay hôm nay để nhận được sự chăm sóc tốt nhất.</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button onClick={openBookingModal} className="px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-100">
                <CalendarIcon className="w-5 h-5 mr-2" /> Đặt Lịch Ngay
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}; 