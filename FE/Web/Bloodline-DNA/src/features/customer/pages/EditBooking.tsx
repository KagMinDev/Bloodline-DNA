import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { 
  updateBookingApi, 
  mapFormDataToUpdateRequest,
  formatDateForInput,
  getStatusDisplayInfo,
  statusToNumber
} from "../api/bookingUpdateApi";
import { 
  getBookingByIdApi, 
  formatBookingDate, 
  formatPrice, 
  getStatusDisplay 
} from "../api/bookingListApi";

// Local interface for BookingItem to avoid import issues
interface BookingItem {
  id: string;
  testServiceId: string;
  clientId: string;
  email: string;
  appointmentDate: string;
  price: number;
  collectionMethod: string;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  clientName: string;
  address: string;
  phone: string;
}

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in_progress';
}

export const EditBooking = (): React.JSX.Element => {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [originalBookingData, setOriginalBookingData] = useState<any>(null);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  // Transform API data to form data - based on BookingItem interface
  const transformApiDataToFormData = (apiData: BookingItem): EditBookingData => {
    const { date, time } = formatDateForInput(apiData.appointmentDate);
    
    // Map collectionMethod to serviceType
    let serviceType: 'home' | 'clinic' = 'home';
    if (apiData.collectionMethod) {
      const method = apiData.collectionMethod.toLowerCase();
      if (method.includes('clinic') || method.includes('center') || method.includes('trung tâm')) {
        serviceType = 'clinic';
      } else if (method.includes('home') || method.includes('nhà') || method.includes('kit')) {
        serviceType = 'home';
      }
    }
    
    return {
      id: apiData.id || '',
      testType: getTestTypeFromCollectionMethod(apiData.collectionMethod) || 'Unknown Service',
      serviceType: serviceType,
      name: apiData.clientName || '',
      phone: apiData.phone || '',
      email: apiData.email || '',
      address: apiData.address || '',
      preferredDate: date,
      preferredTime: time,
      notes: apiData.note || '',
      status: mapApiStatusToUIStatus(apiData.status)
    };
  };

  // Helper function to map API status to UI status
  const mapApiStatusToUIStatus = (apiStatus: string): EditBookingData['status'] => {
    const status = apiStatus.toLowerCase();
    
    switch (status) {
      case 'pending':
      case 'chờ xử lý':
        return 'pending';
      case 'confirmed':
      case 'đã xác nhận':
        return 'confirmed';
      case 'in_progress':
      case 'đang thực hiện':
        return 'in_progress';
      case 'completed':
      case 'hoàn thành':
        return 'completed';
      case 'cancelled':
      case 'đã hủy':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  // Helper function to get test type from collection method
  const getTestTypeFromCollectionMethod = (collectionMethod: string): string => {
    if (!collectionMethod) return 'Unknown Service';
    
    const method = collectionMethod.toLowerCase();
    
    if (method.includes('dân sự') || method.includes('civil')) {
      if (method.includes('kit') || method.includes('tự thu')) {
        return 'ADN Dân Sự - Tự Thu Mẫu (Kit)';
      } else if (method.includes('nhà') || method.includes('home')) {
        return 'ADN Dân Sự - Thu Tại Nhà';
      } else if (method.includes('trung tâm') || method.includes('center') || method.includes('clinic')) {
        return 'ADN Dân Sự - Thu Tại Trung Tâm';
      }
    } else if (method.includes('hành chính') || method.includes('legal')) {
      if (method.includes('hài cốt') || method.includes('bone')) {
        return 'ADN Hành Chính - Giám Định Hài Cốt';
      } else {
        return 'ADN Hành Chính - Thu Tại Trung Tâm';
      }
    }
    
    // Fallback: return the original collection method
    return collectionMethod;
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setApiError("ID đặt lịch không hợp lệ");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setApiError(null);

      try {
        console.log('🔄 Fetching booking data for ID:', bookingId);
        const bookingData = await getBookingByIdApi(bookingId);
        
        if (!bookingData) {
          throw new Error('Không tìm thấy thông tin đặt lịch');
        }
        
        console.log('✅ Received booking data:', bookingData);
        setOriginalBookingData(bookingData);
        
        const transformedData = transformApiDataToFormData(bookingData);
        console.log('📋 Transformed to form data:', transformedData);
        
        setFormData(transformedData);
      } catch (error) {
        console.error('❌ Failed to fetch booking data:', error);
        setApiError(error instanceof Error ? error.message : "Có lỗi xảy ra khi tải thông tin đặt lịch");
      } finally {
        setIsLoading(false);
      }
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

    if (!bookingId) {
      setApiError("ID đặt lịch không hợp lệ");
      return;
    }

    setIsSaving(true);
    setApiError(null);
    
    try {
      console.log('🚀 Starting update process...');
      
      // Map form data to API request format
      const updateRequest = mapFormDataToUpdateRequest(
        bookingId,
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          notes: formData.notes,
        },
        formData.status
      );
      
      console.log('📤 Sending update request:', updateRequest);
      
      // Call update API
      const result = await updateBookingApi(updateRequest);
      
      console.log('✅ Update successful:', result);
      
      // Show success message
      setShowSuccess(true);
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate(`/customer/booking-detail/${bookingId}`);
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error updating booking:', error);
      
      // Handle specific error messages
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
          setApiError("Bạn cần đăng nhập để cập nhật thông tin. Vui lòng đăng nhập và thử lại.");
        } else if (errorMessage.includes('Access denied') || errorMessage.includes('403')) {
          setApiError("Bạn không có quyền cập nhật đặt lịch này.");
        } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          setApiError("Không tìm thấy đặt lịch này. Có thể đặt lịch đã bị xóa hoặc không tồn tại.");
        } else if (errorMessage.includes('Invalid data') || errorMessage.includes('400')) {
          setApiError(`Dữ liệu không hợp lệ: ${errorMessage.split(':')[1] || 'Vui lòng kiểm tra lại thông tin đã nhập.'}`);
        } else if (errorMessage.includes('Validation failed')) {
          setApiError(`Lỗi validate: ${errorMessage.split(':')[1] || 'Vui lòng kiểm tra lại thông tin đã nhập.'}`);
        } else {
          setApiError(`Lỗi cập nhật: ${errorMessage}`);
        }
      } else {
        setApiError("Đã xảy ra lỗi không xác định khi cập nhật đặt lịch. Vui lòng thử lại.");
      }
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

  // Error state
  if (apiError && !formData.id) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h3>
            <p className="text-slate-600 mb-6">{apiError}</p>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-900 hover:bg-blue-800 text-white"
              >
                Thử lại
              </Button>
              <Button
                onClick={() => navigate('/customer/booking-list')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Quay về danh sách
              </Button>
            </div>
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
        <section className="relative w-full py-16 md:py-20 bg-blue-50 overflow-hidden">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-edit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="#1e40af"/>
                  <rect x="4" y="8" width="12" height="4" fill="#1e40af"/>
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
                  <BreadcrumbList className="text-blue-600">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                        Trang Chủ
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-blue-400" />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/customer/booking-list" className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                        Danh Sách Đặt Lịch
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-blue-400" />
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/customer/booking-detail/${formData.id}`} className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                        Chi Tiết Đặt Lịch
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-blue-400" />
                    <BreadcrumbItem>
                      <span className="text-blue-900 font-semibold">Cập Nhật Thông Tin</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight mb-4">
                    Cập Nhật Thông Tin
                    <span className="block text-blue-700 text-xl md:text-2xl font-medium mt-1">
                      Đặt lịch #{formData.id}
                    </span>
                  </h1>
                </div>
                <Button
                  onClick={() => navigate(`/customer/booking-detail/${bookingId}`)}
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
                      {originalBookingData && (
                        <div className="flex items-center gap-4 mt-2 text-sm text-white/75">
                          <span>Ngày tạo: {formatBookingDate(originalBookingData.createdAt)}</span>
                          {originalBookingData.price && (
                            <span>Giá: {formatPrice(originalBookingData.price)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      {formData.serviceType === 'home' ? (
                        <HomeIcon className="w-6 h-6 text-white" />
                      ) : (
                        <BuildingIcon className="w-6 h-6 text-white" />
                      )}
                      <span className="text-white/90">
                        {formData.serviceType === 'home' ? 'Tại nhà' : 'Tại cơ sở'}
                      </span>
                    </div>
                    {originalBookingData && (
                      <div className="text-xs text-white/75">
                        <div>ID: {originalBookingData.testServiceId}</div>
                        <div>Status: {getStatusDisplay(originalBookingData.status).label}</div>
                      </div>
                    )}
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

                  {/* API Error Display */}
                  {apiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircleIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-red-800 font-medium mb-1">Lỗi cập nhật</p>
                          <p className="text-red-700 text-sm">{apiError}</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                      onClick={() => navigate(`/customer/booking-detail/${bookingId}`)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold flex-1 sm:flex-none"
                      disabled={isSaving}
                    >
                      <ArrowLeftIcon className="w-5 h-5 mr-2" />
                      Hủy Bỏ
                    </Button>
                  </div>

                  {/* Booking Information Summary */}
                  {originalBookingData && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Thông tin đặt lịch từ API</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                          <div><strong>ID:</strong> {originalBookingData.id}</div>
                          <div><strong>Test Service ID:</strong> {originalBookingData.testServiceId}</div>
                          <div><strong>Client ID:</strong> {originalBookingData.clientId}</div>
                          <div><strong>Collection Method:</strong> {originalBookingData.collectionMethod}</div>
                          <div><strong>Status:</strong> {originalBookingData.status} - {getStatusDisplay(originalBookingData.status).label}</div>
                          <div><strong>Price:</strong> {originalBookingData.price ? formatPrice(originalBookingData.price) : 'N/A'}</div>
                          <div><strong>Created:</strong> {formatBookingDate(originalBookingData.createdAt)}</div>
                          <div><strong>Updated:</strong> {formatBookingDate(originalBookingData.updatedAt)}</div>
                        </div>
                      </div>
                    </div>
                  )}

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