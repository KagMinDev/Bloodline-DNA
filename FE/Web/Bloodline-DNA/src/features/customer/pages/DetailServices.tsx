import {
  ArrowLeftIcon,
  AwardIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  FlaskConicalIcon,
  HeartIcon,
  HelpCircleIcon,
  PackageIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarCheck2,
  DnaIcon,
  MicroscopeIcon,
  UserCheck,
  CreditCardIcon,
  Headset,
  BookUser,
  TestTube2,
  FileSignature,
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

// ===== HELPER COMPONENTS =====

const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg border flex items-start space-x-4 transition-transform transform hover:-translate-y-1">
        <Icon className="w-10 h-10 text-blue-600 mt-1 flex-shrink-0"/>
        <div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
            <p className="text-gray-600">{children}</p>
        </div>
    </div>
);

const ProcessStep: React.FC<{ number: string, title: string, children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="relative flex flex-col items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md z-10">{number}</div>
        <h3 className="font-semibold text-lg mt-4 mb-2 text-center">{title}</h3>
        <p className="text-sm text-gray-600 text-center max-w-xs">{children}</p>
        {number !== '4' && <div className="absolute top-8 h-0.5 w-full bg-gray-200 hidden md:block" />}
    </div>
);


// ===== MAIN COMPONENT =====
export const DetailServices = (): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);

  const { openBookingModal } = useBookingModal();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadServiceData = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Scroll to top on load
      try {
        if (id) {
          const detail = await getServiceById(id);
          setServiceDetail(detail);
          setError(null);
        } else {
          throw new Error('Không tìm thấy ID dịch vụ');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin dịch vụ';
        setError(errorMessage);
        setServiceDetail(null);
      } finally {
        setLoading(false);
      }
    };
    loadServiceData();
  }, [id]);
  
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

  if (error || !serviceDetail) {
    return (
      <div className="bg-white min-h-screen w-full">
        <Header />
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 80px)'}}>
          <div className="text-center p-4">
            <DnaIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải thông tin dịch vụ</h3>
            <p className="text-gray-600 mb-4">{error || "Dịch vụ bạn tìm không tồn tại."}</p>
            <Button onClick={() => navigate('/services')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    // Get the first active price service as default
    const firstPriceService = serviceDetail.priceServices?.[0];
    
    console.log('🔍 Debug booking data:', {
      serviceDetail,
      firstPriceService,
      serviceName: serviceDetail.name,
      servicePrice: serviceDetail.price,
      priceServicePrice: firstPriceService?.price
    });
    
    openBookingModal({
      id: firstPriceService?.id || serviceDetail.id, // Use priceService.id as main id
      serviceId: serviceDetail.id, // Service detail id as serviceId
      name: serviceDetail.name,
      price: firstPriceService?.price || serviceDetail.price || 0, // Prioritize priceService.price
      category: serviceDetail.category || 'civil',
      collectionMethod: firstPriceService?.collectionMethod || 0,
      testServiceInfor: firstPriceService?.testServiceInfor || {
        id: serviceDetail.id,
        name: serviceDetail.name,
        description: serviceDetail.description,
        category: serviceDetail.category
      }
    });
  };
  
  return (
    <div className="bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-blue-700">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/services" className="hover:text-blue-700">Dịch Vụ</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><span className="font-semibold text-gray-700">{serviceDetail.name}</span></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <section id="hero-section" className="bg-white p-8 rounded-xl shadow-md border mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 leading-tight">{serviceDetail.name}</h1>
                <p className="text-lg text-gray-600 mb-8">{serviceDetail.description || "Dịch vụ xét nghiệm ADN hàng đầu, cung cấp kết quả chính xác và đáng tin cậy cho các nhu cầu cá nhân và pháp lý."}</p>
                
                <Button onClick={handleBooking} size="lg" className="w-full md:w-auto text-lg !text-white bg-blue-600 hover:bg-blue-700">
                  Đặt Lịch Ngay
                </Button>
              </div>
              <div className="flex items-center justify-center">
                  <DnaIcon className="w-48 h-48 text-blue-100" />
              </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gói Dịch Vụ Bao Gồm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <InfoCard icon={PackageIcon} title="Bộ Kit Lấy Mẫu">Bộ dụng cụ chuyên dụng, vô trùng và dễ sử dụng tại nhà.</InfoCard>
              <InfoCard icon={FileSignature} title="Báo Cáo Chi Tiết">Bản phân tích kết quả đầy đủ, diễn giải rõ ràng và dễ hiểu.</InfoCard>
              <InfoCard icon={UserCheck} title="Bảo Mật Thông Tin">Cam kết bảo mật tuyệt đối dữ liệu cá nhân và kết quả xét nghiệm.</InfoCard>
              <InfoCard icon={Headset} title="Tư Vấn Chuyên Gia">Hỗ trợ giải đáp mọi thắc mắc trước và sau khi có kết quả.</InfoCard>
          </div>
        </section>

        {/* How it works Section */}
        <section className="bg-white rounded-xl shadow-md border p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Quy Trình 4 Bước Đơn Giản</h2>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProcessStep number="1" title="Đặt Lịch">Chọn dịch vụ và đặt lịch trực tuyến hoặc qua hotline.</ProcessStep>
              <ProcessStep number="2" title="Thu Mẫu">Tự thu mẫu tại nhà theo hướng dẫn hoặc đến trung tâm.</ProcessStep>
              <ProcessStep number="3" title="Phân Tích">Mẫu của bạn được xử lý tại phòng lab đạt chuẩn quốc tế.</ProcessStep>
              <ProcessStep number="4" title="Nhận Kết Quả">Nhận kết quả bảo mật qua email hoặc Zalo sau vài ngày.</ProcessStep>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tại Sao Chọn Bloodline DNA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InfoCard icon={ShieldCheckIcon} title="Độ Chính Xác 99.999%">Sử dụng công nghệ giải trình tự gen thế hệ mới nhất cho kết quả đáng tin cậy.</InfoCard>
                <InfoCard icon={AwardIcon} title="Tiêu Chuẩn Quốc Tế">Phòng xét nghiệm đạt chuẩn ISO 17025, đảm bảo quy trình nghiêm ngặt.</InfoCard>
                <InfoCard icon={MicroscopeIcon} title="Công Nghệ Hiện Đại">Hệ thống máy móc và trang thiết bị được nhập khẩu từ Mỹ, Đức.</InfoCard>
                <InfoCard icon={BookUser} title="Chuyên Gia Hàng Đầu">Đội ngũ kỹ thuật viên và chuyên gia di truyền giàu kinh nghiệm.</InfoCard>
                <InfoCard icon={HeartIcon} title="Tư Vấn Tận Tâm">Chúng tôi luôn đặt sự hài lòng và an tâm của khách hàng lên hàng đầu.</InfoCard>
                <InfoCard icon={ClockIcon} title="Trả Kết Quả Nhanh">Quy trình tối ưu giúp rút ngắn thời gian chờ đợi của khách hàng.</InfoCard>
            </div>
        </section>

        {/* Testimonial Section */}
        <section className="mb-16">
            <div className="bg-blue-600 text-white rounded-xl p-8 md:p-12 text-center">
                <p className="text-xl italic mb-4">"Dịch vụ rất chuyên nghiệp và nhanh chóng. Nhờ Bloodline DNA mà gia đình tôi đã giải tỏa được mọi nghi ngờ. Cảm ơn trung tâm rất nhiều!"</p>
                <p className="font-bold text-lg">- Anh Nguyễn Văn A, TP. Hồ Chí Minh</p>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}; 