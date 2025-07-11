import {
  AlertCircleIcon,
  BuildingIcon,
  CalendarIcon,
  CircleSlash2,
  ClockIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  StarIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "../components/ui/Input";
// Import booking list API
import {
  formatPrice,
  getBookingListApi,
  type BookingItem
} from "../api/bookingListApi";
// Import statusConfig từ BookingStatusPage để đồng bộ
import { getStatusConfigByDetailedStatus } from "../components/bookingStatus/StatusConfig";
import { FeedbackModal } from "../components/FeedbackModal";
import type { DetailedBookingStatus } from "../types/bookingTypes";

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
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-20 overflow-hidden md:py-28 bg-blue-50">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/></svg>
          </div>
          <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
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
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">Theo dõi và quản lý tất cả các lịch hẹn xét nghiệm của bạn một cách dễ dàng và tiện lợi.</p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã, loại xét nghiệm, tên..."
                  className="py-3 pl-10 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <FilterIcon className="w-5 h-5 mr-2 text-gray-600" />
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
        <section className="py-16 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8">
              <p className="text-lg text-slate-600">
                Tìm thấy <span className="font-semibold text-blue-900">{filteredBookings.length}</span> lịch hẹn
              </p>
            </div>

            {isLoading ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
                <p className="text-slate-600">Đang tải danh sách...</p>
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <CircleSlash2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="mb-4 text-slate-500">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="text-white bg-blue-900 hover:bg-blue-800"
                  style={{color: "white"}}
                >
                  Thử Lại
                </Button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-slate-600">Không có lịch hẹn nào</h3>
                <Button onClick={() => openBookingModal()} className="text-white bg-blue-900 hover:bg-blue-800">
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
                    <Card key={booking.id} className="transition-shadow duration-300 bg-white border-0 shadow-lg hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                                <p className="mb-1 text-lg font-semibold text-slate-700">{booking.testType}</p>
                                <p className="font-medium text-blue-600">{booking.name}</p>
                              </div>
                              <div className="text-right">
                              <p className="text-sm text-slate-500">Tổng chi phí</p>
                                <p className="text-2xl font-bold text-green-600">{booking.price}</p>
                                
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
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
                              <div className="p-3 mt-4 rounded-lg bg-blue-50">
                                <p className="text-sm text-blue-800">
                                  <strong>Lưu ý:</strong> {booking.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 mt-4">
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <Button 
                                variant="outline" 
                                className="w-full sm:w-auto"
                                onClick={() => navigate(`/customer/booking-status/${booking.id}`)}
                              >
                                <EyeIcon className="w-4 h-4 mr-2" />
                                Xem chi tiết
                              </Button>
                              <Button 
                                className="w-full text-white bg-blue-600 sm:w-auto hover:bg-blue-700"
                                onClick={() => navigate(`/customer/edit-booking/${booking.id}`)}
                              >
                                <EditIcon className="w-4 h-4 mr-2" />
                                Sửa
                              </Button>
                            </div>
                            {booking.status === 'Completed' && (
                              <Button 
                                className="w-full text-white bg-yellow-500 hover:bg-yellow-600"
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