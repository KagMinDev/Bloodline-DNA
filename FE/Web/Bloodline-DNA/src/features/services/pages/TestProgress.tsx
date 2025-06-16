import {
  AlertCircleIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  FileTextIcon,
  FlaskConicalIcon,
  MailIcon,
  PackageIcon,
  PhoneIcon,
  TruckIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
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

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  estimatedDate?: string;
  details?: string[];
}

interface TestProgressData {
  bookingId: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  customerName: string;
  currentStep: number;
  steps: ProgressStep[];
  trackingNumber?: string;
  expectedResultDate?: string;
}

export const TestProgress = (): React.JSX.Element => {
  const [progressData, setProgressData] = useState<TestProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get booking ID from URL (in real app, use useParams from react-router)
  const bookingId = "BL001234";

  const sampleProgressData: TestProgressData = {
    bookingId: "BL001234",
    testType: "Xét nghiệm tổng quát",
    serviceType: "home",
    customerName: "Nguyễn Văn An",
    currentStep: 3,
    trackingNumber: "TN001234567",
    expectedResultDate: "2024-02-20",
    steps: [
      {
        id: 1,
        title: "Đăng ký đặt hẹn dịch vụ xét nghiệm",
        description: "Yêu cầu đặt lịch đã được ghi nhận và xác nhận",
        icon: CalendarIcon,
        status: 'completed',
        completedDate: "2024-02-10T10:30:00",
        details: [
          "Đơn đặt hẹn được tạo thành công",
          "Xác nhận thông tin khách hàng",
          "Phí dịch vụ đã được thanh toán"
        ]
      },
      {
        id: 2,
        title: "Nhận bộ kit xét nghiệm",
        description: "Bộ kit đã được chuẩn bị và giao đến địa chỉ",
        icon: PackageIcon,
        status: 'completed',
        completedDate: "2024-02-14T14:20:00",
        details: [
          "Bộ kit được đóng gói và vận chuyển",
          "Giao hàng thành công tại địa chỉ",
          "Khách hàng đã xác nhận nhận kit"
        ]
      },
      {
        id: 3,
        title: "Thu thập mẫu xét nghiệm",
        description: "Khách hàng đang tiến hành thu thập mẫu",
        icon: FlaskConicalIcon,
        status: 'current',
        details: [
          "Hướng dẫn chi tiết đã được cung cấp",
          "Thời gian thu mẫu tối đa: 48h sau khi nhận kit",
          "Liên hệ hotline nếu cần hỗ trợ"
        ]
      },
      {
        id: 4,
        title: "Chuyển mẫu đến cơ sở y tế",
        description: "Mẫu xét nghiệm sẽ được vận chuyển đến phòng lab",
        icon: TruckIcon,
        status: 'pending',
        estimatedDate: "2024-02-16",
        details: [
          "Đặt lịch thu mẫu tại nhà",
          "Vận chuyển trong điều kiện bảo quản đặc biệt",
          "Thời gian vận chuyển: 6-8 tiếng"
        ]
      },
      {
        id: 5,
        title: "Thực hiện xét nghiệm tại cơ sở y tế",
        description: "Mẫu được xử lý và phân tích tại phòng lab",
        icon: BuildingIcon,
        status: 'pending',
        estimatedDate: "2024-02-18",
        details: [
          "Kiểm tra chất lượng mẫu",
          "Tiến hành các test cần thiết",
          "Thời gian xử lý: 2-3 ngày làm việc"
        ]
      },
      {
        id: 6,
        title: "Ghi nhận kết quả xét nghiệm",
        description: "Kết quả được xác thực và ghi nhận chính thức",
        icon: ClipboardCheckIcon,
        status: 'pending',
        estimatedDate: "2024-02-19",
        details: [
          "Bác sĩ chuyên khoa xem xét kết quả",
          "Kiểm tra và xác thực thông tin",
          "Chuẩn bị báo cáo chi tiết"
        ]
      },
      {
        id: 7,
        title: "Trả kết quả xét nghiệm",
        description: "Kết quả được gửi đến khách hàng",
        icon: FileTextIcon,
        status: 'pending',
        estimatedDate: "2024-02-20",
        details: [
          "Gửi kết quả qua email và SMS",
          "Có thể tải về từ trang web",
          "Tư vấn kết quả nếu cần thiết"
        ]
      }
    ]
  };

  useEffect(() => {
    const fetchProgressData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgressData(sampleProgressData);
      setIsLoading(false);
    };

    fetchProgressData();
  }, [bookingId]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <p className="text-slate-600">Đang tải thông tin theo dõi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircleIcon className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="mb-2 text-xl font-semibold text-slate-600">Không tìm thấy thông tin</h3>
            <p className="mb-6 text-slate-500">Không thể tải thông tin theo dõi xét nghiệm</p>
            <Button onClick={() => window.history.back()} className="text-white bg-blue-900 hover:bg-blue-800">
              Quay Lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[280px] overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003875]">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-progress" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-progress)" />
            </svg>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex items-center h-full">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
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
                      <BreadcrumbLink href="/booking-list" className="transition-colors duration-200 text-white/80 hover:text-white">
                        Danh Sách Đặt Lịch
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/60" />
                    <BreadcrumbItem>
                      <span className="text-[#00D4FF] font-semibold">Theo Dõi Quá Trình</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Title & Info */}
              <div className="grid items-center grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                    Theo Dõi Quá Trình
                    <span className="block text-[#00D4FF] text-xl md:text-2xl font-medium mt-1">
                      {progressData.testType}
                    </span>
                  </h1>
                  <p className="text-white/90">Mã đặt lịch: {progressData.bookingId}</p>
                </div>
                
                <div className="lg:text-right">
                  <div className="inline-block p-4 rounded-lg bg-white/20 backdrop-blur-sm">
                    <p className="mb-2 text-sm text-white/80">Dự kiến có kết quả</p>
                    {progressData.expectedResultDate && (
                      <p className="text-[#00D4FF] text-xl font-bold">
                        {formatDate(progressData.expectedResultDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Timeline */}
        <section className="py-16 md:py-20 bg-blue-50">
          <div className="container max-w-5xl px-4 mx-auto md:px-6 lg:px-8">
            {/* Progress Overview */}
            <div className="mb-12">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-slate-800">
                        Tiến độ hiện tại: Bước {progressData.currentStep}/7
                      </h3>
                      <p className="text-slate-600">
                        {progressData.steps.find(step => step.id === progressData.currentStep)?.title}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {progressData.trackingNumber && (
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Mã theo dõi</p>
                          <p className="font-mono font-semibold text-blue-900">{progressData.trackingNumber}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                        <span className="text-2xl font-bold text-blue-900">
                          {Math.round((progressData.currentStep / 7) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div 
                        className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-600 to-blue-500"
                        style={{ width: `${(progressData.currentStep / 7) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-6">
              {progressData.steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === progressData.steps.length - 1;
                
                return (
                  <div key={step.id} className="relative">
                    {/* Connecting Line */}
                    {!isLast && (
                      <div className={`absolute left-6 top-16 w-0.5 h-16 ${
                        step.status === 'completed' ? 'bg-green-500' : 
                        step.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                    
                    <Card className={`bg-white shadow-lg border-0 transition-all duration-300 ${
                      step.status === 'current' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Step Icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.status === 'completed' ? 'bg-green-100 text-green-600' :
                            step.status === 'current' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircleIcon className="w-6 h-6" />
                            ) : step.status === 'current' ? (
                              <ClockIcon className="w-6 h-6" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>
                          
                          {/* Step Content */}
                          <div className="flex-1">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1">
                                <h3 className={`text-lg font-bold mb-2 ${
                                  step.status === 'completed' ? 'text-green-700' :
                                  step.status === 'current' ? 'text-blue-700' :
                                  'text-gray-600'
                                }`}>
                                  {step.title}
                                </h3>
                                <p className="mb-4 text-slate-600">{step.description}</p>
                                
                                {step.details && (
                                  <ul className="space-y-2">
                                    {step.details.map((detail, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                                          step.status === 'completed' ? 'bg-green-500' :
                                          step.status === 'current' ? 'bg-blue-500' :
                                          'bg-gray-400'
                                        }`}></div>
                                        {detail}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              
                              {/* Date Info */}
                              <div className="flex-shrink-0 text-right">
                                {step.completedDate && (
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-green-600">Hoàn thành</p>
                                    <p className="text-sm text-slate-500">{formatDateTime(step.completedDate)}</p>
                                  </div>
                                )}
                                {step.estimatedDate && !step.completedDate && (
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-blue-600">Dự kiến</p>
                                    <p className="text-sm text-slate-500">{formatDate(step.estimatedDate)}</p>
                                  </div>
                                )}
                                
                                {/* Step Number */}
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                  step.status === 'completed' ? 'bg-green-500 text-white' :
                                  step.status === 'current' ? 'bg-blue-500 text-white' :
                                  'bg-gray-300 text-gray-600'
                                }`}>
                                  {step.id}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Support Section */}
            <div className="mt-12">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="mb-4 text-xl font-bold text-slate-800">Cần Hỗ Trợ?</h3>
                    <p className="mb-6 text-slate-600">
                      Nếu bạn có bất kỳ thắc mắc nào về quá trình xét nghiệm, đừng ngần ngại liên hệ với chúng tôi
                    </p>
                    
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Gọi Hotline: 1900-xxxx
                      </Button>
                      <Button
                        variant="outline"
                        className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
                      >
                        <MailIcon className="w-4 h-4 mr-2" />
                        Email: support@bloodline.vn
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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