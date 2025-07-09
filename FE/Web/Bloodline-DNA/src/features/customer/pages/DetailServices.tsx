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

// ===== MAIN COMPONENT =====
export const DetailServices = (): React.JSX.Element => {
  // State
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
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
  
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
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
    openBookingModal({
      id: serviceDetail.id,
      name: serviceDetail.name,
      price: serviceDetail.price,
    });
  };

  const faqs = serviceDetail.faqs || [
    { question: "Tôi có cần nhịn ăn trước khi lấy mẫu không?", answer: "Không. Đối với xét nghiệm ADN sử dụng mẫu niêm mạc miệng hoặc mẫu máu, bạn không cần nhịn ăn." },
    { question: "Mất bao lâu để có kết quả?", answer: `Thời gian trả kết quả thường từ ${serviceDetail.turnaroundTime || '2-3 ngày làm việc'} sau khi phòng lab nhận được mẫu.` },
    { question: "Kết quả có được bảo mật không?", answer: "Có. Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng. Chỉ những người có trong đơn đăng ký mới được nhận kết quả." },
  ];
  
  return (
    <div className="bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
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
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Service Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Hero section for the service */}
            <section>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 leading-tight">{serviceDetail.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{serviceDetail.description || "Dịch vụ xét nghiệm ADN hàng đầu, cung cấp kết quả chính xác và đáng tin cậy cho các nhu cầu cá nhân và pháp lý."}</p>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center text-green-600 font-bold">
                  <CreditCardIcon className="w-6 h-6 mr-2" />
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serviceDetail.price)}</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>{serviceDetail.turnaroundTime || '2-3 ngày'}</span>
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">Tại Sao Chọn Chúng Tôi?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border flex items-start space-x-4">
                      <ShieldCheckIcon className="w-10 h-10 text-blue-600 mt-1"/>
                      <div>
                          <h3 className="font-bold text-lg text-gray-800">Độ Chính Xác 99.999%</h3>
                          <p className="text-gray-600">Sử dụng công nghệ giải trình tự gen thế hệ mới nhất cho kết quả đáng tin cậy.</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border flex items-start space-x-4">
                      <AwardIcon className="w-10 h-10 text-blue-600 mt-1"/>
                      <div>
                          <h3 className="font-bold text-lg text-gray-800">Tiêu Chuẩn Quốc Tế</h3>
                          <p className="text-gray-600">Phòng xét nghiệm đạt chuẩn ISO 17025, đảm bảo quy trình nghiêm ngặt.</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border flex items-start space-x-4">
                      <UserCheck className="w-10 h-10 text-blue-600 mt-1"/>
                      <div>
                          <h3 className="font-bold text-lg text-gray-800">Bảo Mật Tuyệt Đối</h3>
                          <p className="text-gray-600">Thông tin cá nhân và kết quả của bạn được mã hóa và bảo vệ an toàn.</p>
                      </div>
                  </div>
                   <div className="bg-white p-6 rounded-lg border flex items-start space-x-4">
                      <HeartIcon className="w-10 h-10 text-blue-600 mt-1"/>
                      <div>
                          <h3 className="font-bold text-lg text-gray-800">Tư Vấn Tận Tâm</h3>
                          <p className="text-gray-600">Đội ngũ chuyên gia sẵn sàng giải đáp mọi thắc mắc trước và sau xét nghiệm.</p>
                      </div>
                  </div>
              </div>
            </section>

            {/* How it works Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Quy Trình 4 Bước Đơn Giản</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">1</div>
                      <h3 className="font-bold mt-4 mb-2">Đặt Lịch</h3>
                      <p className="text-sm text-gray-600">Chọn dịch vụ và đặt lịch trực tuyến hoặc qua hotline.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">2</div>
                      <h3 className="font-bold mt-4 mb-2">Thu Mẫu</h3>
                      <p className="text-sm text-gray-600">Tự thu mẫu tại nhà theo hướng dẫn hoặc đến trung tâm.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">3</div>
                      <h3 className="font-bold mt-4 mb-2">Phân Tích</h3>
                      <p className="text-sm text-gray-600">Mẫu của bạn được phân tích tại phòng lab hiện đại.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">4</div>
                      <h3 className="font-bold mt-4 mb-2">Nhận Kết Quả</h3>
                      <p className="text-sm text-gray-600">Nhận kết quả bảo mật qua email hoặc Zalo sau vài ngày.</p>
                  </div>
              </div>
            </section>
            
            {/* FAQ Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">Câu Hỏi Thường Gặp</h2>
              <div className="space-y-4">
                {faqs.map((faq: { question: string; answer: string }, index: number) => (
                  <div key={index} className="bg-white border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800"
                    >
                      <span>{faq.question}</span>
                      {openFAQ === index ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                    {openFAQ === index && (
                      <div className="p-4 pt-0 text-gray-600">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Booking Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center justify-center mb-4">
                <DnaIcon className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{serviceDetail.name}</h3>
              <p className="text-center text-2xl font-bold text-green-600 mb-6">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serviceDetail.price)}</p>
              
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" /><span>Độ chính xác trên 99.999%</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" /><span>Phòng lab chuẩn ISO 17025</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" /><span>Bảo mật thông tin khách hàng</span></li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" /><span>Trả kết quả nhanh chóng</span></li>
              </ul>

              <Button
                onClick={handleBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
              >
                Đặt Lịch Ngay
              </Button>
            </div>
          </aside>
        </div>
      </main>
      
      {/* Final CTA Section */}
      <section className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Sẵn sàng khám phá sự thật?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Hãy để Bloodline DNA giúp bạn tìm thấy câu trả lời bạn đang tìm kiếm với công nghệ xét nghiệm ADN tiên tiến và dịch vụ chuyên nghiệp.
            </p>
            <Button
              onClick={handleBooking}
              className="bg-green-500 hover:bg-green-600 text-white text-xl px-12 py-4 rounded-lg"
            >
              Bắt Đầu Ngay
            </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}; 