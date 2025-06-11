import React, { useState, useEffect } from "react";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  HomeIcon,
  BuildingIcon,
  EditIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  PrinterIcon,
  DownloadIcon
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

interface BookingDetail {
  id: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  name: string;
  phone: string;
  email: string;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  bookingDate: string;
  price: string;
  basePrice: string;
  shippingFee?: string;
  totalPrice: string;
  estimatedDelivery?: string;
  appointmentCode: string;
}

const statusConfig = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircleIcon,
    description: 'Yêu cầu đặt lịch đang được xử lý'
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircleIcon,
    description: 'Lịch hẹn đã được xác nhận thành công'
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
    description: 'Dịch vụ đã được thực hiện hoàn tất'
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
    description: 'Lịch hẹn đã bị hủy bỏ'
  }
};

export const BookingDetail = (): React.JSX.Element => {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get booking ID from URL (in real app, use useParams from react-router)
  const bookingId = "BL001234";

  const sampleBooking: BookingDetail = {
    id: "BL001234",
    testType: "Xét nghiệm tổng quát",
    serviceType: "home",
    name: "Nguyễn Văn An",
    phone: "0123456789",
    email: "nguyenvanan@gmail.com",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    preferredDate: "2024-02-15",
    preferredTime: "09:00",
    status: "confirmed",
    notes: "Vui lòng gọi trước khi đến. Tôi ở tầng 5, căn hộ A5-12",
    bookingDate: "2024-02-10T10:30:00",
    basePrice: "500.000đ",
    shippingFee: "50.000đ",
    price: "550.000đ",
    totalPrice: "550.000đ",
    estimatedDelivery: "2024-02-14",
    appointmentCode: "APT-001234"
  };

  useEffect(() => {
    const fetchBookingDetail = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBooking(sampleBooking);
      setIsLoading(false);
    };

    fetchBookingDetail();
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Không tìm thấy lịch hẹn</h3>
            <p className="text-slate-500 mb-6">Lịch hẹn không tồn tại hoặc đã bị xóa</p>
            <Button onClick={() => window.history.back()} className="bg-blue-900 hover:bg-blue-800 text-white">
              Quay Lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[booking.status].icon;

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[240px] overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003875]">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-detail" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-detail)" />
            </svg>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
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
                      <BreadcrumbLink href="/booking-list" className="text-white/80 hover:text-white transition-colors duration-200">
                        Danh Sách Đặt Lịch
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/60" />
                    <BreadcrumbItem>
                      <span className="text-[#00D4FF] font-semibold">Chi Tiết Đặt Lịch</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    Chi Tiết Đặt Lịch
                    <span className="block text-[#00D4FF] text-xl md:text-2xl font-medium mt-1">
                      #{booking.id}
                    </span>
                  </h1>
                </div>
                <Button
                  onClick={() => window.history.back()}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  variant="outline"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Quay Lại
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Detail Content */}
        <section className="py-16 md:py-20 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Card */}
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusConfig[booking.status].color}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{statusConfig[booking.status].label}</h3>
                          <p className="text-slate-600">{statusConfig[booking.status].description}</p>
                        </div>
                      </div>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button
                          onClick={() => window.location.href = `/booking-edit/${booking.id}`}
                          className="bg-blue-900 hover:bg-blue-800 text-white"
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Cập Nhật
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Ngày đặt lịch</p>
                        <p className="font-semibold text-slate-700">{formatDateTime(booking.bookingDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Mã cuộc hẹn</p>
                        <p className="font-semibold text-slate-700">{booking.appointmentCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Information */}
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-blue-50 p-6 border-b">
                    <h3 className="text-xl font-bold text-blue-900">Thông Tin Dịch Vụ</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {booking.serviceType === 'home' ? 
                            <HomeIcon className="w-5 h-5 text-blue-600" /> : 
                            <BuildingIcon className="w-5 h-5 text-blue-600" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">{booking.testType}</p>
                          <p className="text-sm text-slate-500">
                            {booking.serviceType === 'home' ? 'Tự thu mẫu tại nhà' : 'Thu mẫu tại cơ sở'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-slate-500">Ngày hẹn</p>
                            <p className="font-medium text-slate-700">{formatDate(booking.preferredDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-slate-500">Thời gian</p>
                            <p className="font-medium text-slate-700">{booking.preferredTime}</p>
                          </div>
                        </div>
                      </div>

                      {booking.estimatedDelivery && booking.serviceType === 'home' && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Dự kiến giao kit:</strong> {formatDate(booking.estimatedDelivery)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-blue-50 p-6 border-b">
                    <h3 className="text-xl font-bold text-blue-900">Thông Tin Khách Hàng</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-slate-500">Họ và tên</p>
                          <p className="font-medium text-slate-700">{booking.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-slate-500">Số điện thoại</p>
                          <p className="font-medium text-slate-700">{booking.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:col-span-2">
                        <MailIcon className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium text-slate-700">{booking.email}</p>
                        </div>
                      </div>
                      {booking.address && (
                        <div className="flex items-start gap-3 md:col-span-2">
                          <MapPinIcon className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="text-sm text-slate-500">Địa chỉ</p>
                            <p className="font-medium text-slate-700">{booking.address}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-amber-800 mb-1">Lưu ý từ khách hàng:</p>
                          <p className="text-amber-700">{booking.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Payment Summary */}
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-green-50 p-6 border-b">
                    <h3 className="text-xl font-bold text-green-900">Tóm Tắt Thanh Toán</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Giá dịch vụ</span>
                        <span className="font-medium">{booking.basePrice}</span>
                      </div>
                      {booking.shippingFee && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Phí vận chuyển</span>
                          <span className="font-medium">{booking.shippingFee}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-800">Tổng cộng</span>
                          <span className="font-bold text-xl text-green-600">{booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-blue-50 p-6 border-b">
                    <h3 className="text-xl font-bold text-blue-900">Thao Tác</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
                        <PrinterIcon className="w-4 h-4 mr-2" />
                        In Phiếu Hẹn
                      </Button>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Tải PDF
                      </Button>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button 
                          className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                          onClick={() => window.location.href = `/booking-edit/${booking.id}`}
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Cập Nhật Thông Tin
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-purple-50 p-6 border-b">
                    <h3 className="text-xl font-bold text-purple-900">Hỗ Trợ</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-slate-600 mb-4">
                      Cần hỗ trợ về lịch hẹn này? Liên hệ với chúng tôi.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Hotline:</strong> <a href="tel:1900xxxx" className="text-blue-600 hover:underline">1900-xxxx</a>
                      </p>
                      <p className="text-sm">
                        <strong>Email:</strong> <a href="mailto:support@bloodline.vn" className="text-blue-600 hover:underline">support@bloodline.vn</a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
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