import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  PhoneIcon,
  HomeIcon,
  BuildingIcon,
  AlertCircleIcon,
  StarIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
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
import { useBookingModal } from "../components/BookingModalContext";
// Import booking list API
import { 
  getBookingListApi, 
  formatBookingDate, 
  formatPrice, 
  getStatusDisplay,
  type BookingItem 
} from "../api/bookingListApi";
// Import statusConfig từ BookingStatusPage để đồng bộ
import { getStatusConfigByDetailedStatus } from "../components/bookingStatus/StatusConfig";
import type { DetailedBookingStatus } from "../types/bookingTypes";
import { FeedbackModal } from "../components/FeedbackModal";

interface Booking {
  id: string;
  testServiceId: string; // Add testServiceId field
  testType: string;
  serviceType: 'home' | 'clinic';
  name: string;
  phone: string;
  email: string;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  status: DetailedBookingStatus;
  notes?: string;
  bookingDate: string;
  price: string;
  collectionMethod: string;
}

export const BookingList = (): React.JSX.Element => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState<Booking | null>(null);

  const { openBookingModal } = useBookingModal();
  const navigate = useNavigate();

  // Helper function to transform API data to Booking interface
  const transformApiDataToBooking = (item: BookingItem): Booking => {
    // Parse appointmentDate to get date and time
    const appointmentDate = new Date(item.appointmentDate);
    const preferredDate = appointmentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const preferredTime = appointmentDate.toTimeString().substring(0, 5); // HH:MM
    
    // Parse createdAt for bookingDate
    const createdAt = new Date(item.createdAt);
    const bookingDate = createdAt.toISOString().split('T')[0];
    
    // Map collectionMethod to serviceType - FIX: sử dụng logic đúng 0/1
    const serviceType: 'home' | 'clinic' = (() => {
      // Kiểm tra nếu collectionMethod là number
      if (typeof item.collectionMethod === 'number') {
        return item.collectionMethod === 0 ? 'home' : 'clinic';
      }
      
      // Kiểm tra nếu collectionMethod là string number
      const methodNum = parseInt(item.collectionMethod);
      if (!isNaN(methodNum)) {
        return methodNum === 0 ? 'home' : 'clinic';
      }
      
      // Fallback: nếu là string, kiểm tra nội dung
      const methodStr = item.collectionMethod?.toLowerCase() || '';
      return methodStr.includes('home') || methodStr.includes('nhà') || methodStr.includes('0') ? 'home' : 'clinic';
    })();
    
    // Normalize status to match DetailedBookingStatus - FIX: sử dụng PascalCase  
    const normalizeStatus = (status: string): DetailedBookingStatus => {
      const statusLower = status.toLowerCase();
      
      // Map theo DetailedBookingStatus (PascalCase)
      if (statusLower.includes('pending') || statusLower.includes('chờ')) return 'Pending';
      if (statusLower.includes('confirmed') || statusLower.includes('xác nhận')) return 'PreparingKit'; // Assume confirmed moves to preparing
      if (statusLower.includes('preparing') || statusLower.includes('chuẩn bị')) return 'PreparingKit';
      if (statusLower.includes('delivering') || statusLower.includes('giao')) return 'DeliveringKit';
      if (statusLower.includes('delivered') || statusLower.includes('nhận kit')) return 'KitDelivered';
      if (statusLower.includes('waiting') || statusLower.includes('chờ mẫu')) return 'WaitingForSample';
      if (statusLower.includes('returning') || statusLower.includes('vận chuyển')) return 'ReturningSample';
      if (statusLower.includes('received') || statusLower.includes('nhận mẫu')) return 'SampleReceived';
      if (statusLower.includes('testing') || statusLower.includes('phân tích')) return 'Testing';
      if (statusLower.includes('payment') || statusLower.includes('thanh toán')) return 'Completed'; // Map payment to completed for now
      if (statusLower.includes('completed') || statusLower.includes('hoàn thành')) return 'Completed';
      if (statusLower.includes('cancelled') || statusLower.includes('hủy')) return 'Cancelled';
      
      return 'Pending'; // Default fallback
    };
    
    return {
      id: item.id,
      testServiceId: item.testServiceId, // Add testServiceId from API
      testType: `Xét nghiệm ADN`, // Default since API doesn't have testType
      serviceType,
      name: item.clientName,
      phone: item.phone,
      email: item.email,
      address: item.address || '',
      preferredDate,
      preferredTime,
      status: normalizeStatus(item.status),
      notes: item.note || '',
      bookingDate,
      price: formatPrice(item.price),
      collectionMethod: item.collectionMethod
    };
  };

  useEffect(() => {
    // Fetch bookings from API
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Fetching bookings from API...');
        const apiData = await getBookingListApi();
        console.log('✅ API data received:', apiData);
        
        const formattedBookings = apiData.map(transformApiDataToBooking);
        console.log('✅ Formatted bookings:', formattedBookings);
        
        // Sort bookings by createdAt descending (newest first)
        const sortedBookings = formattedBookings.sort((a, b) => {
          const dateA = new Date(a.bookingDate);
          const dateB = new Date(b.bookingDate);
          return dateB.getTime() - dateA.getTime();
        });
        
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } catch (err) {
        console.error('❌ Error fetching bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
        // Use empty array as fallback
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFeedbackClick = (booking: Booking) => {
    console.log('🔄 Opening feedback modal for booking:', booking.id);
    setSelectedBookingForFeedback(booking);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalOpen(false);
    setSelectedBookingForFeedback(null);
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

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
                  <BreadcrumbItem><span className="font-semibold text-blue-900">Danh Sách Đặt Lịch</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Danh Sách Đặt Lịch
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                Quản lý lịch hẹn xét nghiệm
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed md:text-lg text-gray-700">Theo dõi và quản lý tất cả các lịch hẹn xét nghiệm của bạn một cách dễ dàng và tiện lợi.</p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã, loại xét nghiệm, tên..."
                  className="pl-10 pr-4 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <FilterIcon className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="PreparingKit">Đang chuẩn bị Kit</option>
                  <option value="DeliveringKit">Đang giao Kit</option>
                  <option value="KitDelivered">Đã nhận Kit</option>
                  <option value="WaitingForSample">Chờ nhận mẫu</option>
                  <option value="ReturningSample">Đang vận chuyển mẫu</option>
                  <option value="SampleReceived">Đã nhận mẫu</option>
                  <option value="Testing">Đang phân tích</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings List */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8">
              <p className="text-lg text-slate-600">
                Tìm thấy <span className="font-semibold text-blue-900">{filteredBookings.length}</span> lịch hẹn
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Đang tải danh sách...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Có lỗi xảy ra</h3>
                <p className="text-slate-500 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-900 hover:bg-blue-800 text-white"
                >
                  Thử Lại
                </Button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Không có lịch hẹn nào</h3>
                <Button onClick={() => openBookingModal()} className="bg-blue-900 hover:bg-blue-800 text-white">
                  Đặt Lịch Mới
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBookings.map((booking) => {
                  const statusInfo = getStatusConfigByDetailedStatus(booking.status);
                  const StatusIcon = statusInfo?.icon || AlertCircleIcon;
                  const ServiceIcon = booking.serviceType === 'home' ? HomeIcon : BuildingIcon;
                  
                  return (
                    <Card key={booking.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-blue-900">#{booking.id}</h3>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {statusInfo?.label || booking.status}
                                  </span>
                                </div>
                                <p className="text-lg font-semibold text-slate-700 mb-1">{booking.testType}</p>
                                <p className="text-blue-600 font-medium">{booking.name}</p>
                              </div>
                              <div className="text-right">
                              <p className="text-sm text-slate-500">Tổng chi phí</p>
                                <p className="text-2xl font-bold text-green-600">{booking.price}</p>
                                
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center text-slate-600">
                                <ServiceIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.collectionMethod === 'SelfSample' ? 'Khách Hàng Tự Thu Mẫu' : 'Thu mẫu tại cơ sở'}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {formatDate(booking.preferredDate)}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.preferredTime}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <PhoneIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.phone}
                              </div>
                              {booking.address && (
                                <div className="flex items-center text-slate-600 md:col-span-2">
                                  <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                                  {booking.address}
                                </div>
                              )}
                            </div>

                            {booking.notes && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Lưu ý:</strong> {booking.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 mt-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button 
                                variant="outline" 
                                className="w-full sm:w-auto"
                                onClick={() => navigate(`/customer/booking-status/${booking.id}`)}
                              >
                                <EyeIcon className="w-4 h-4 mr-2" />
                                Xem chi tiết
                              </Button>
                              <Button 
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => navigate(`/customer/edit-booking/${booking.id}`)}
                              >
                                <EditIcon className="w-4 h-4 mr-2" />
                                Sửa
                              </Button>
                            </div>
                            {booking.status === 'Completed' && (
                              <Button 
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                onClick={() => handleFeedbackClick(booking)}
                              >
                                <StarIcon className="w-4 h-4 mr-2" />
                                Đánh giá
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="relative">
          <Footer />
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedBookingForFeedback && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={handleFeedbackModalClose}
          bookingId={selectedBookingForFeedback.id}
          testServiceId={selectedBookingForFeedback.testServiceId} // Use correct testServiceId
        />
      )}
    </div>
  );
}; 