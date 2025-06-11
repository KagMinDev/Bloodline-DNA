import React, { useState, useEffect } from "react";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  SaveIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  HomeIcon,
  BuildingIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Header } from "../../../components";
import { Footer } from "../../../components";

interface EditBookingData {
  id: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  name: string;
  phone: string;
  email: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const EditBooking = (): React.JSX.Element => {
  const [formData, setFormData] = useState<EditBookingData>({
    id: '',
    testType: '',
    serviceType: 'home',
    name: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    status: 'pending'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Get booking ID from URL (in real app, use useParams from react-router)
  const bookingId = "BL001234";

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const sampleBookingData: EditBookingData = {
    id: "BL001234",
    testType: "Xét nghiệm tổng quát",
    serviceType: "home",
    name: "Nguyễn Văn An",
    phone: "0123456789",
    email: "nguyenvanan@gmail.com",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    preferredDate: "2024-02-15",
    preferredTime: "09:00",
    notes: "Vui lòng gọi trước khi đến. Tôi ở tầng 5, căn hộ A5-12",
    status: "confirmed"
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(sampleBookingData);
      setIsLoading(false);
    };

    fetchBookingData();
  }, [bookingId]);

  const handleInputChange = (field: keyof EditBookingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.serviceType === 'home' && !formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ nhận kit';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Vui lòng chọn ngày hẹn';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.preferredDate = 'Ngày hẹn không thể trong quá khứ';
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Vui lòng chọn thời gian hẹn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setShowSuccess(true);
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        window.location.href = `/booking-detail/${formData.id}`;
      }, 2000);
      
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
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
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Cập nhật thành công!</h3>
            <p className="text-slate-600 mb-6">
              Thông tin đặt lịch đã được cập nhật. Đang chuyển hướng...
            </p>
            <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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
                <pattern id="medical-cross-edit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-edit)" />
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
                      <BreadcrumbLink href={`/booking-detail/${formData.id}`} className="text-white/80 hover:text-white transition-colors duration-200">
                        Chi Tiết Đặt Lịch
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/60" />
                    <BreadcrumbItem>
                      <span className="text-[#00D4FF] font-semibold">Cập Nhật Thông Tin</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    Cập Nhật Thông Tin
                    <span className="block text-[#00D4FF] text-xl md:text-2xl font-medium mt-1">
                      Đặt lịch #{formData.id}
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

        {/* Edit Form */}
        <section className="py-16 md:py-20 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Chỉnh Sửa Thông Tin Đặt Lịch</h2>
                      <p className="text-white/90">{formData.testType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.serviceType === 'home' ? (
                      <HomeIcon className="w-6 h-6 text-white" />
                    ) : (
                      <BuildingIcon className="w-6 h-6 text-white" />
                    )}
                    <span className="text-white/90">
                      {formData.serviceType === 'home' ? 'Tại nhà' : 'Tại cơ sở'}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Warning */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 font-medium mb-1">Lưu ý quan trọng</p>
                        <p className="text-amber-700 text-sm">
                          Việc thay đổi thông tin có thể ảnh hưởng đến lịch trình xét nghiệm. 
                          Vui lòng kiểm tra kỹ trước khi lưu.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Họ và Tên *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full border-2 rounded-lg p-3 ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Số Điện Thoại *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full border-2 rounded-lg p-3 ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <MailIcon className="w-4 h-4 mr-2" />
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full border-2 rounded-lg p-3 ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="Nhập địa chỉ email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>

                    {/* Address Field - Only for home service */}
                    {formData.serviceType === 'home' && (
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-blue-900 flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          Địa Chỉ Nhận Kit *
                        </label>
                        <Input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`w-full border-2 rounded-lg p-3 ${
                            errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                          }`}
                          placeholder="Nhập địa chỉ nhận bộ kit xét nghiệm"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm">{errors.address}</p>
                        )}
                      </div>
                    )}

                    {/* Date Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Ngày Hẹn *
                      </label>
                      <Input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full border-2 rounded-lg p-3 ${
                          errors.preferredDate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.preferredDate && (
                        <p className="text-red-500 text-sm">{errors.preferredDate}</p>
                      )}
                      {formData.preferredDate && (
                        <p className="text-blue-600 text-sm">
                          {formatDate(formData.preferredDate)}
                        </p>
                      )}
                    </div>

                    {/* Time Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Thời Gian Hẹn *
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                        className={`w-full border-2 rounded-lg p-3 focus:outline-none ${
                          errors.preferredTime ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Chọn thời gian</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.preferredTime && (
                        <p className="text-red-500 text-sm">{errors.preferredTime}</p>
                      )}
                    </div>

                    {/* Notes Field */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <AlertCircleIcon className="w-4 h-4 mr-2" />
                        Lưu Ý Thêm
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Nhập lưu ý hoặc yêu cầu đặc biệt (nếu có)"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold flex-1 sm:flex-none"
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Đang lưu...
                        </div>
                      ) : (
                        <>
                          <SaveIcon className="w-5 h-5 mr-2" />
                          Lưu Thay Đổi
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => window.history.back()}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold flex-1 sm:flex-none"
                      disabled={isSaving}
                    >
                      <ArrowLeftIcon className="w-5 h-5 mr-2" />
                      Hủy Bỏ
                    </Button>
                  </div>

                  {/* Info Note */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Sau khi cập nhật thông tin, hệ thống sẽ gửi email xác nhận đến địa chỉ email của bạn.
                        Nếu có thay đổi về thời gian, nhân viên sẽ liên hệ lại để xác nhận.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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