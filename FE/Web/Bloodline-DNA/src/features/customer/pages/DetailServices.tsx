import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BriefcaseMedicalIcon,
  BuildingIcon,
  BoxIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardEditIcon,
  ClockIcon,
  FileTextIcon,
  FlaskConicalIcon,
  HeartIcon,
  HomeIcon,
  InfoIcon,
  ShieldIcon,
  StarIcon,
  StethoscopeIcon,
  TruckIcon,
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
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);

  const { openBookingModal } = useBookingModal();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const passedServiceDetail = location.state?.serviceDetail;
  const passedError = location.state?.error;

  useEffect(() => {
    const loadServiceData = async () => {
      setLoading(true);
      try {
        if (passedServiceDetail) {
          setServiceDetail(passedServiceDetail);
          return;
        }
        if (passedError) {
          setError(passedError);
          return;
        }
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
  }, [id, passedServiceDetail, passedError]);
  
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
            <div className="text-red-500 mb-4">
              <StethoscopeIcon className="w-16 h-16 mx-auto" />
            </div>
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

  // Debug logging
  console.log('🔍 ServiceDetail object:', serviceDetail);
  console.log('📝 Service name:', serviceDetail.name);
  console.log('📝 All object keys:', Object.keys(serviceDetail));
  console.log('📝 PriceServices:', serviceDetail.priceServices);
  console.log('📝 First priceService:', serviceDetail.priceServices?.[0]);
  console.log('📝 TestServiceInfor from first price:', serviceDetail.priceServices?.[0]?.testServiceInfor);

  // Try to get name from multiple possible sources
  const serviceDetailAny = serviceDetail as any;
  const serviceName = 
    serviceDetail.name || 
    serviceDetail.priceServices?.[0]?.testServiceInfor?.name ||
    serviceDetailAny.title ||
    serviceDetailAny.serviceName ||
    serviceDetail.id ||
    "Dịch vụ xét nghiệm ADN";

  console.log('🎯 Final service name used:', serviceName);

  const serviceData = {
    title: "Chi Tiết Dịch Vụ Xét Nghiệm",
    subtitle: serviceName,
    description: serviceDetail.description || "Dịch vụ xét nghiệm ADN hàng đầu, cung cấp giải pháp chính xác, bảo mật và nhanh chóng cho cả mục đích dân sự và hành chính.",
    heroImage: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
  };
  
  const collectionMethods = [
      {
          title: "Tự Thu Mẫu Tại Nhà (Bộ KIT)",
          description: "Nhận bộ kit xét nghiệm chuyên dụng, tự thu mẫu theo hướng dẫn chi tiết. Tiện lợi, riêng tư và dễ dàng.",
          icon: <BoxIcon className="w-10 h-10 text-blue-600" />,
          type: 'self-collection',
          price: '1.500.000đ',
          tags: ["Chỉ cho Dân sự", "Tiện lợi", "Bảo mật"],
          buttonText: "Chọn Gói Tự Thu Mẫu"
      },
      {
          title: "Thu Mẫu Chuyên Nghiệp",
          description: "Đặt hẹn để nhân viên y tế của chúng tôi thu mẫu tại nhà hoặc tại trung tâm. Đảm bảo quy trình chuẩn xác, an toàn.",
          icon: <BriefcaseMedicalIcon className="w-10 h-10 text-green-600" />,
          type: 'professional-collection',
          price: '2.500.000đ',
          tags: ["Dân sự & Hành chính", "Chính xác", "Pháp lý"],
          buttonText: "Chọn Gói Chuyên Nghiệp"
      }
  ];

  const processSteps = {
      'self-collection': [
          { icon: <ClipboardEditIcon/>, title: "Đăng Ký Dịch Vụ", description: "Chọn gói và đăng ký online." },
          { icon: <BoxIcon/>, title: "Nhận Bộ Kit", description: "Chúng tôi gửi bộ kit đến tận nhà bạn." },
          { icon: <FlaskConicalIcon/>, title: "Tự Thu Mẫu", description: "Làm theo hướng dẫn chi tiết trong kit." },
          { icon: <TruckIcon/>, title: "Gửi Mẫu", description: "Gửi mẫu đã thu thập về trung tâm." },
          { icon: <FileTextIcon/>, title: "Nhận Kết Quả", description: "Kết quả được trả online sau 5-7 ngày." },
      ],
      'professional-collection': [
          { icon: <CalendarIcon/>, title: "Đặt Lịch Hẹn", description: "Chọn thời gian và địa điểm phù hợp." },
          { icon: <StethoscopeIcon/>, title: "Thu Mẫu", description: "Nhân viên y tế tiến hành thu mẫu." },
          { icon: <FlaskConicalIcon/>, title: "Phân Tích", description: "Mẫu được phân tích tại phòng lab hiện đại." },
          { icon: <FileTextIcon/>, title: "Nhận Kết Quả", description: "Kết quả được trả sau 3-5 ngày." },
      ]
  };

  const pricingTiers = [
    { 
      category: "Dân Sự",
      items: [
        { name: "Tự thu mẫu (bộ kit)", price: "1.500.000đ", time: "5-7 ngày", popular: true },
        { name: "Thu mẫu tại trung tâm", price: "2.000.000đ", time: "3-5 ngày" },
        { name: "Thu mẫu tại nhà", price: "2.500.000đ", time: "3-5 ngày" }
      ]
    },
    { 
      category: "Hành Chính (Pháp lý)",
      items: [
        { name: "Thu mẫu tại trung tâm", price: "3.500.000đ", time: "7-10 ngày", popular: true },
        { name: "Giám định hài cốt", price: "Liên hệ", time: "30+ ngày" }
      ],
      note: "Quy trình nghiêm ngặt, có giá trị pháp lý."
    }
  ];

  const faqs = [
    { question: "Bộ kit tự thu mẫu có khó sử dụng không?", answer: "Không. Bộ kit được thiết kế để dễ sử dụng với hướng dẫn chi tiết từng bước. Bạn chỉ cần làm theo là có thể tự lấy mẫu một cách chính xác." },
    { question: "Kết quả xét nghiệm ADN dân sự có dùng cho mục đích pháp lý được không?", answer: "Không. Xét nghiệm dân sự chỉ mang tính chất tham khảo cá nhân. Để có giá trị pháp lý (làm giấy khai sinh, tòa án), bạn phải sử dụng dịch vụ xét nghiệm ADN Hành chính với quy trình thu mẫu và giám sát nghiêm ngặt." },
    { question: "Mất bao lâu để có kết quả?", answer: "Thời gian có kết quả phụ thuộc vào loại xét nghiệm và phương thức thu mẫu. Gói tự thu mẫu thường mất 5-7 ngày, trong khi gói thu mẫu chuyên nghiệp có kết quả sau 3-5 ngày. Các trường hợp giám định phức tạp sẽ cần nhiều thời gian hơn." },
    { question: "Thông tin của tôi có được bảo mật không?", answer: "Tuyệt đối. Chúng tôi cam kết bảo mật 100% thông tin khách hàng và kết quả xét nghiệm theo quy định của pháp luật." }
  ];

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="relative w-full max-w-none">
        <Header />

        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-28 bg-blue-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/></svg>
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
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">{serviceData.title}
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                {serviceData.subtitle}
                {/* Debug info */}
                {!serviceData.subtitle && <span className="text-red-500">[Subtitle is empty]</span>}
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed md:text-lg text-gray-700">{serviceData.description}</p>
          </div>
                </section>

        {/* Process Section */}
        <section className="py-16 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">Quy Trình Thực Hiện</h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">Minh bạch và đơn giản hóa các bước để bạn dễ dàng theo dõi.</p>
            </div>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              {Object.entries(processSteps).map(([type, steps]) => (
                <Card key={type} className="p-8 bg-white border-2 border-blue-600 shadow-2xl rounded-xl transition-transform duration-300 hover:-translate-y-1">
                  <h3 className="mb-8 text-2xl font-bold text-center text-blue-800 pb-4 border-b-2 border-gray-200">
                    {type === 'self-collection' ? 'Quy Trình Tự Thu Mẫu' : 'Quy Trình Chuyên Nghiệp'}
                  </h3>
                  <div className="relative pt-4 pl-8 border-l-2 border-blue-200">
                    {steps.map((step, index) => (
                      <div key={index} className="relative mb-10">
                        <div className="absolute -left-[42px] top-1 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-md ring-4 ring-white">
                          {React.cloneElement(step.icon, { className: 'w-6 h-6' })}
                        </div>
                        <div className="pl-4">
                           <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                           <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Table Section */}
        <section className="py-16 md:py-20 bg-blue-50">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
                <div className="mb-12 text-center md:mb-16">
                    <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">Bảng Giá Dịch Vụ</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600">Rõ ràng, minh bạch và không có chi phí ẩn.</p>
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {pricingTiers.map(tier => (
                        <Card key={tier.category} className="flex flex-col p-8 bg-white shadow-2xl rounded-xl border-2 border-blue-600 transition-transform duration-300 hover:-translate-y-1">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6 -mx-2 -mt-2">
                                <h3 className="text-2xl font-bold text-center">{tier.category}</h3>
                            </div>
                            <ul className="flex-grow space-y-4">
                                {tier.items.map(item => (
                                    <li key={item.name} className="flex justify-between items-center p-4 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">⏱️ Thời gian: {item.time}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-bold text-blue-600 text-lg">{item.price}</p>
                                          {item.popular && (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                              ⭐ Phổ biến
                                            </span>
                                          )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {tier.note && (
                                <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-center text-amber-700 font-medium">ℹ️ {tier.note}</p>
                                </div>
                            )}
                            <Button onClick={openBookingModal} variant="outline" className="w-full mt-8 py-3 font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-300 hover:shadow-md">
                              📞 Tư Vấn & Đặt Hẹn
                            </Button>
                                        </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Choose Collection Method Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
                    <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">Chọn Phương Thức Thu Mẫu</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600">Chúng tôi cung cấp hai lựa chọn linh hoạt để phù hợp với nhu cầu của bạn.</p>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {collectionMethods.map((method) => (
                        <Card key={method.type} className="flex flex-col text-center p-8 bg-white border-2 border-blue-600 shadow-2xl rounded-xl transition-transform duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100">{method.icon}</div>
                            <h3 className="mb-3 text-2xl font-bold text-gray-800">{method.title}</h3>
                            <p className="flex-grow mb-6 text-gray-600">{method.description}</p>
                            <div className="flex justify-center gap-2 mb-6">
                                {method.tags.map(tag => <span key={tag} className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{tag}</span>)}
            </div>
                            <Button onClick={openBookingModal} className="w-full py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">{method.buttonText}</Button>
                        </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white md:py-20">
          <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">Câu Hỏi Thường Gặp</h2>
              <p className="text-lg leading-relaxed text-gray-700">Giải đáp các thắc mắc phổ biến về dịch vụ của chúng tôi.</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden border border-gray-200 rounded-lg">
                  <CardHeader className="p-6 cursor-pointer hover:bg-gray-50" onClick={() => toggleFAQ(index)}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                      {openFAQ === index ? <ChevronUpIcon className="w-5 h-5 text-blue-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500" />}
                    </div>
                  </CardHeader>
                  {openFAQ === index && <CardContent className="px-6 pt-0 pb-6"><p className="leading-relaxed text-gray-700">{faq.answer}</p></CardContent>}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-800 to-blue-600">
          <div className="container max-w-4xl px-4 mx-auto text-center md:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Bạn có câu hỏi hoặc sẵn sàng đặt lịch?</h2>
            <p className="mb-8 text-lg text-white/90">Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button onClick={openBookingModal} className="px-8 py-3 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-100">
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