import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FileTextIcon,
  FlaskConicalIcon,
  ClipboardCheckIcon,
  TruckIcon,
  PackageIcon,
  InfoIcon,
  CreditCardIcon,
  SendIcon,
  SearchIcon,
  DnaIcon,
  StarIcon
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
import { Header, Footer } from "../../../components";
import ChatbotAI from "../../chatbotAI/components/ChatbotAI";
import { 
  getBookingByIdApi, 
  formatBookingDate, 
  formatPrice, 
  type BookingItem 
} from "../api/bookingListApi";
import { 
  checkoutPaymentApi, 
  calculateDeposit, 
  formatPaymentAmount,
  checkoutRemainingPaymentApi
} from "../api/paymentApi";
import { submitFeedbackApi } from "../api/feedbackApi";
import { getUserInfoApi } from "../api/userApi";

// --- Interfaces from both files ---

type DetailedBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'preparingkit'
  | 'deliveringkit'
  | 'kitdelivered'
  | 'waitingforsample'
  | 'returningsample'
  | 'samplereceived'
  | 'testing'
  | 'finalpayment' // Added this new status
  | 'completed'
  | 'cancelled';

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
  status: DetailedBookingStatus;
  notes?: string;
  bookingDate: string;
  price: string;
  totalPrice: string;
  appointmentCode: string;
  priceNumeric?: number;
}

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  estimatedDate?: string;
  details?: string[];
  actionRequired?: boolean;
  actionText?: string;
  actionPayload?: any; // For payment type
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

export const BookingStatusPage = (): React.JSX.Element => {
  const statusConfig: Record<DetailedBookingStatus, { label: string; color: string; icon: React.ElementType; description: string; }> = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircleIcon, description: 'Yêu cầu đặt lịch đang được xử lý' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-sky-100 text-sky-800', icon: CheckCircleIcon, description: 'Lịch hẹn đã được xác nhận' },
    preparingkit: { label: 'Đang chuẩn bị Kit', color: 'bg-sky-100 text-sky-800', icon: ClipboardCheckIcon, description: 'Bộ kit xét nghiệm đang được chuẩn bị' },
    deliveringkit: { label: 'Đang giao Kit', color: 'bg-blue-100 text-blue-800', icon: TruckIcon, description: 'Bộ kit đang được giao đến bạn' },
    kitdelivered: { label: 'Đã nhận Kit', color: 'bg-blue-100 text-blue-800', icon: PackageIcon, description: 'Bạn đã nhận được bộ kit xét nghiệm' },
    waitingforsample: { label: 'Chờ nhận mẫu', color: 'bg-orange-100 text-orange-800', icon: ClockIcon, description: 'Chờ nhận mẫu xét nghiệm từ bạn' },
    returningsample: { label: 'Đang vận chuyển mẫu', color: 'bg-orange-100 text-orange-800', icon: TruckIcon, description: 'Mẫu của bạn đang được vận chuyển đến phòng lab' },
    samplereceived: { label: 'Đã nhận mẫu', color: 'bg-indigo-100 text-indigo-800', icon: DnaIcon, description: 'Phòng lab đã nhận được mẫu của bạn' },
    testing: { label: 'Đang phân tích', color: 'bg-purple-100 text-purple-800', icon: FlaskConicalIcon, description: 'Mẫu của bạn đang được phân tích' },
    finalpayment: { label: 'Chờ thanh toán', color: 'bg-rose-100 text-rose-800', icon: CreditCardIcon, description: 'Vui lòng thanh toán số tiền còn lại để xem kết quả.' },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, description: 'Dịch vụ đã được thực hiện hoàn tất' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircleIcon, description: 'Lịch hẹn đã bị hủy bỏ' }
  };

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [progressData, setProgressData] = useState<TestProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'progress'>('detail');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Feedback state
  const [userId, setUserId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- Payment Handler ---
  const handlePayment = async (payload?: any) => {
    if (!booking) {
      console.error('❌ No booking data available for payment');
      setPaymentError('Không tìm thấy thông tin đặt lịch');
      return;
    }
    
    // Debug booking data in detail
    console.log('💳 Starting payment process for booking:', {
      bookingId: booking.id,
      appointmentCode: booking.appointmentCode,
      totalPrice: booking.totalPrice,
      priceNumeric: booking.priceNumeric,
      bookingIdType: typeof booking.id,
      bookingIdLength: booking.id?.length,
      rawBookingObject: booking
    });
    
    // Validate booking ID format
    if (!booking.id || booking.id.trim() === '') {
      console.error('❌ Invalid booking ID:', booking.id);
      setPaymentError('ID booking không hợp lệ');
      return;
    }
    
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      let result;
      // Differentiate between deposit and remaining payment
      if (payload?.type === 'remaining' || booking.status === 'finalpayment') {
        console.log('🚀 Calling REMAINING payment API with bookingId:', booking.id);
        result = await checkoutRemainingPaymentApi(booking.id);
      } else {
        console.log('🚀 Calling DEPOSIT payment API with bookingId:', booking.id);
        result = await checkoutPaymentApi(booking.id);
      }
      
      console.log('✅ Payment API response:', result);
      
      if (result.success) {
        const checkoutUrl = result.checkoutUrl;
        if (checkoutUrl) {
          console.log('🔗 Opening payment URL in new tab:', checkoutUrl);
          // Open payment URL in new tab
          const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
          // if (newWindow) {
          //   newWindow.opener = null;
          // } else {
          //   console.warn('⚠️ Popup was blocked. Falling back to direct URL opening...');
          //   window.location.href = checkoutUrl;
          // }
        } else {
          // Handle success without redirect URL (maybe already paid or different flow)
          console.log('✅ Payment processed successfully:', result.message);
          // Could show success message or update UI here
          alert(`Thanh toán thành công: ${result.message}`);
        }
      } else {
        throw new Error(result.message || 'Không thể tạo link thanh toán');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ Payment error:', err);
      setPaymentError(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!userId || !bookingId) {
      setFeedbackError("Không thể xác định người dùng hoặc đơn hàng.");
      return;
    }
    if (rating === 0) {
      setFeedbackError("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (comment.trim() === "") {
      setFeedbackError("Vui lòng nhập nội dung bình luận.");
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    try {
      const payload = {
        userId,
        testServiceId: bookingId,
        rating,
        comment,
      };
      const response = await submitFeedbackApi(payload);
      if (response.success) {
        setFeedbackSuccess("Cảm ơn bạn đã gửi đánh giá!");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // --- Data Transformation and Fetching Logic ---

  const transformApiDataToBookingDetail = (item: BookingItem): BookingDetail => {
    const appointmentDate = new Date(item.appointmentDate);
    const preferredDate = appointmentDate.toISOString().split('T')[0];
    const preferredTime = appointmentDate.toTimeString().substring(0, 5);
    
    const serviceType: 'home' | 'clinic' = 
      item.collectionMethod?.toLowerCase().includes('home') || 
      item.collectionMethod?.toLowerCase().includes('nhà') ? 'home' : 'clinic';
    
    const normalizeStatus = (status: string): DetailedBookingStatus => {
      const statusLower = (status || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (statusLower.includes('cancelled') || statusLower.includes('hủy')) return 'cancelled';
      if (statusLower.includes('completed') || statusLower.includes('hoànthành')) return 'completed';
      if (statusLower.includes('finalpayment')) return 'finalpayment';
      if (statusLower.includes('testing')) return 'testing';
      if (statusLower.includes('samplereceived')) return 'samplereceived';
      if (statusLower.includes('returningsample')) return 'returningsample';
      if (statusLower.includes('waitingforsample')) return 'waitingforsample';
      if (statusLower.includes('kitdelivered')) return 'kitdelivered';
      if (statusLower.includes('deliveringkit')) return 'deliveringkit';
      if (statusLower.includes('preparingkit')) return 'preparingkit';
      if (statusLower.includes('confirmed') || statusLower.includes('xácnhận')) return 'confirmed';
      if (statusLower.includes('pending') || statusLower.includes('chờ')) return 'pending';
      
      console.warn(`Unknown booking status from API: "${status}". Defaulting to 'pending'.`);
      return 'pending';
    };
    
    return {
      id: item.id,
      testType: 'Xét nghiệm ADN',
      serviceType,
      name: item.clientName,
      phone: item.phone,
      email: item.email,
      address: item.address || '',
      preferredDate,
      preferredTime,
      status: normalizeStatus(item.status),
      notes: item.note || '',
      bookingDate: item.createdAt,
      price: formatPrice(item.price),
      totalPrice: formatPrice(item.price),
      appointmentCode: `APT-${item.id.slice(-6)}`,
      priceNumeric: item.price
    };
  };

  // Updated progress data with new flow
  const generateProgressData = (booking: BookingDetail): TestProgressData => {
    const baseDate = new Date(booking.bookingDate);
    const bookingStatus = booking.status;

    let steps: ProgressStep[] = [];

    // Step 1: Booking Confirmed (Always completed)
    steps.push({
      id: 1,
      title: 'Đăng Ký Lịch Thành Công',
      description: 'Yêu cầu đặt lịch đã được ghi nhận thành công',
      icon: CalendarIcon,
      status: 'completed',
      completedDate: booking.bookingDate,
    });

    // Handle cancellation
    if (bookingStatus === 'cancelled') {
      steps.push({
        id: 2,
        title: 'Lịch hẹn đã bị hủy',
        description: 'Lịch hẹn của bạn đã bị hủy do yêu cầu của bạn hoặc lý do khác.',
        icon: XCircleIcon,
        status: 'current',
        completedDate: new Date().toISOString(), // Placeholder, ideally from API
      });
      
      return {
        bookingId: booking.id,
        testType: booking.testType,
        serviceType: booking.serviceType,
        customerName: booking.name,
        currentStep: 2,
        steps,
      };
    }

    // Step 2: Pay Deposit
    const isDepositPaid = bookingStatus !== 'pending';
    steps.push({
      id: 2,
      title: 'Thanh Toán Đặt Cọc 20%',
      description: booking.priceNumeric ? `Thanh toán đặt cọc ${formatPaymentAmount(calculateDeposit(booking.priceNumeric))}` : 'Thanh toán đặt cọc 20% của tổng chi phí',
      icon: CreditCardIcon,
      status: isDepositPaid ? 'completed' : 'current',
      actionRequired: !isDepositPaid,
      actionText: 'Thanh toán đặt cọc',
      actionPayload: { type: 'deposit' },
      // completedDate: isDepositPaid ? findDateForStatus('confirmed') : undefined,
    });

    // Step 3: Receive TestKit
    const kitStatuses: DetailedBookingStatus[] = ['kitdelivered', 'waitingforsample', 'returningsample', 'samplereceived', 'testing', 'completed'];
    const kitCurrentStatuses: DetailedBookingStatus[] = ['confirmed', 'preparingkit', 'deliveringkit'];
    
    let kitStatus: ProgressStep['status'] = 'pending';
    let kitDetails: string[] = [];
    
    if (kitStatuses.includes(bookingStatus)) {
      kitStatus = 'completed';
    } else if (kitCurrentStatuses.includes(bookingStatus)) {
      kitStatus = 'current';
      if (bookingStatus === 'confirmed') kitDetails.push('Đơn hàng đã được xác nhận, chờ chuẩn bị kit.');
      if (bookingStatus === 'preparingkit') kitDetails.push('Đang chuẩn bị bộ kit.');
      if (bookingStatus === 'deliveringkit') kitDetails.push('Bộ kit đang trên đường giao đến bạn.');
    }
    
    steps.push({
      id: 3,
      title: 'Nhận TestKit',
      description: booking.serviceType === 'home' ? 'Nhận bộ kit xét nghiệm tại nhà' : 'Nhận kit tại trung tâm',
      icon: PackageIcon,
      status: kitStatus,
      details: kitDetails,
      estimatedDate: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    // Step 4: Send Sample
    const sampleStatuses: DetailedBookingStatus[] = ['samplereceived', 'testing', 'completed'];
    const sampleCurrentStatuses: DetailedBookingStatus[] = ['waitingforsample', 'returningsample'];

    let sampleStatus: ProgressStep['status'] = 'pending';
    let sampleDetails: string[] = [];

    if (sampleStatuses.includes(bookingStatus)) {
      sampleStatus = 'completed';
    } else if (sampleCurrentStatuses.includes(bookingStatus)) {
      sampleStatus = 'current';
      if (bookingStatus === 'waitingforsample') sampleDetails.push('Vui lòng gửi mẫu của bạn đến trung tâm theo hướng dẫn.');
      if (bookingStatus === 'returningsample') sampleDetails.push('Mẫu của bạn đang được chuyển đến phòng lab.');
    }
    
    steps.push({
      id: 4,
      title: 'Chuyển Mẫu Đến Cơ Sở',
      description: 'Mẫu được vận chuyển đến phòng lab an toàn',
      icon: TruckIcon,
      status: sampleStatus,
      details: sampleDetails,
      estimatedDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    // Step 5: Pay Remaining Amount
    const isRemainingPaid = ['testing', 'completed'].includes(bookingStatus);
    let remainingPaymentStatus: ProgressStep['status'] = 'pending';
    if (isRemainingPaid) {
      remainingPaymentStatus = 'completed';
    } else if (bookingStatus === 'samplereceived') {
      remainingPaymentStatus = 'current';
    }
    
    steps.push({
      id: 5,
      title: 'Thanh Toán Phần Còn Lại',
      description: booking.priceNumeric ? `Thanh toán ${formatPaymentAmount(booking.priceNumeric - calculateDeposit(booking.priceNumeric))}` : 'Thanh toán phần còn lại của chi phí',
      icon: CreditCardIcon,
      status: remainingPaymentStatus,
      actionRequired: remainingPaymentStatus === 'current',
      actionText: 'Thanh toán số tiền còn lại',
      actionPayload: { type: 'remaining' },
    });

    // Step 6: Sample Analysis
    let analysisStatus: ProgressStep['status'] = 'pending';
    let analysisDetails: string[] = [];
    if (bookingStatus === 'completed') {
      analysisStatus = 'completed';
    } else if (bookingStatus === 'testing') {
      analysisStatus = 'current';
      analysisDetails.push('Mẫu đang được phân tích bởi các chuyên gia.');
    }
    
    steps.push({
      id: 6,
      title: 'Phân Tích Mẫu',
      description: 'Mẫu được xử lý và phân tích tại phòng lab chuyên nghiệp',
      icon: FlaskConicalIcon,
      status: analysisStatus,
      details: analysisDetails,
      estimatedDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    // Step 7: Get Results
    steps.push({
      id: 7,
      title: 'Trả Kết Quả',
      description: 'Kết quả xét nghiệm được gửi đến bạn qua email và SMS',
      icon: FileTextIcon,
      status: bookingStatus === 'completed' ? 'completed' : 'pending',
      estimatedDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const currentStepIndex = steps.findIndex(step => step.status === 'current');

    return {
      bookingId: booking.id,
      testType: booking.testType,
      serviceType: booking.serviceType,
      customerName: booking.name,
      currentStep: currentStepIndex !== -1 ? steps[currentStepIndex].id : steps.length,
      steps,
      trackingNumber: `TRK-${booking.id.slice(-8)}`,
      expectedResultDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setError('ID booking không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch booking and user info in parallel
        const [apiData, userData] = await Promise.all([
          getBookingByIdApi(bookingId),
          getUserInfoApi()
        ]);

        if (userData) {
          setUserId(userData.id);
        }

        if (!apiData) {
          setError('Không tìm thấy thông tin booking');
          setBooking(null);
          return;
        }

        const formattedBooking = transformApiDataToBookingDetail(apiData);
        setBooking(formattedBooking);

        // Generate progress data based on booking
        const progressData = generateProgressData(formattedBooking);
        setProgressData(progressData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking details');
        setBooking(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // --- Helper Functions ---

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Đang tải thông tin đơn hẹn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">{error || "Không tìm thấy lịch hẹn"}</h3>
            <p className="text-slate-500 mb-6">{error ? "Vui lòng thử lại sau." : "Lịch hẹn không tồn tại hoặc đã bị xóa."}</p>
            <Button onClick={() => navigate('/booking-list')} className="bg-blue-900 hover:bg-blue-800 text-white">Về Danh Sách</Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[booking.status].icon;

  const renderDetailTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="bg-blue-50/50">
                    <h3 className="font-bold text-blue-900">Thông Tin Dịch Vụ</h3>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        {booking.serviceType === 'home' ? <HomeIcon className="w-8 h-8 text-blue-600" /> : <BuildingIcon className="w-8 h-8 text-blue-600" />}
                        <div>
                            <p className="font-semibold text-slate-800">{booking.testType}</p>
                            <p className="text-sm text-slate-500">{booking.serviceType === 'home' ? 'Thu mẫu tại nhà' : 'Thu mẫu tại trung tâm'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-slate-500" /><span className="font-medium">{formatDate(booking.preferredDate)}</span></div>
                        <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-slate-500" /><span className="font-medium">{booking.preferredTime}</span></div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="bg-blue-50/50">
                    <h3 className="font-bold text-blue-900">Thông Tin Khách Hàng</h3>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex items-center gap-3"><UserIcon className="w-5 h-5 text-blue-500" /><div><p className="text-sm text-slate-500">Họ tên</p><p className="font-medium">{booking.name}</p></div></div>
                    <div className="flex items-center gap-3"><PhoneIcon className="w-5 h-5 text-blue-500" /><div><p className="text-sm text-slate-500">Điện thoại</p><p className="font-medium">{booking.phone}</p></div></div>
                    <div className="col-span-2 flex items-center gap-3"><MailIcon className="w-5 h-5 text-blue-500" /><div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{booking.email}</p></div></div>
                    {booking.address && <div className="col-span-2 flex items-start gap-3"><MapPinIcon className="w-5 h-5 text-blue-500 mt-1" /><div><p className="text-sm text-slate-500">Địa chỉ</p><p className="font-medium">{booking.address}</p></div></div>}
                    {booking.notes && <div className="col-span-2 mt-4 pt-4 border-t"><p className="text-sm font-medium text-slate-600 mb-1">Ghi chú:</p><p className="text-sm text-slate-500 italic">"{booking.notes}"</p></div>}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader className="bg-green-50/50">
                    <h3 className="font-bold text-green-900">Thanh Toán</h3>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-slate-600"><span>Giá dịch vụ</span><span>{booking.price}</span></div>
                        {booking.priceNumeric && (
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Đặt cọc (20%)</span>
                                <span className="font-medium text-orange-600">{formatPaymentAmount(calculateDeposit(booking.priceNumeric))}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-slate-800 pt-2 border-t"><span>Tổng cộng</span><span className="text-lg text-green-600">{booking.totalPrice}</span></div>
                    </div>
                    
                    {/* Payment Button */}
                    {progressData?.steps.find(s => s.id === 2 && s.actionRequired && s.status === 'current') && (
                        <div className="pt-4 border-t">
                            {paymentError && (
                                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center">
                                        <AlertCircleIcon className="w-4 h-4 text-red-600 mr-2" />
                                        <p className="text-sm text-red-800">{paymentError}</p>
                                    </div>
                                </div>
                            )}
                            <Button 
                                onClick={() => handlePayment({ type: 'deposit' })}
                                disabled={paymentLoading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                            >
                                {paymentLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Đang xử lý thanh toán...
                                    </div>
                                ) : (
                                    <>
                                        <CreditCardIcon className="w-5 h-5 mr-2" />
                                        Thanh toán đặt cọc {booking.priceNumeric ? formatPaymentAmount(calculateDeposit(booking.priceNumeric)) : ''}
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-slate-500 mt-2 text-center">
                                Thanh toán an toàn với VNPay, MoMo, Banking
                            </p>
                            <p className="text-xs text-blue-600 mt-1 text-center font-medium">
                                Booking ID: {booking.id}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="bg-purple-50/50">
                    <h3 className="font-bold text-purple-900">Hỗ Trợ</h3>
                </CardHeader>
                <CardContent className="p-6 text-sm text-slate-600">
                    <p className="mb-2">Cần hỗ trợ? Liên hệ với chúng tôi qua:</p>
                    <p><strong>Hotline:</strong> <a href="tel:19001234" className="text-blue-600 hover:underline">1900-1234</a></p>
                    <p><strong>Email:</strong> <a href="mailto:support@bloodline.vn" className="text-blue-600 hover:underline">support@bloodline.vn</a></p>
                </CardContent>
            </Card>
        </div>
    </div>
  );

  const renderProgressTab = () => {
    if (!progressData) return <p>Không có dữ liệu tiến trình.</p>;
    
    const completedSteps = progressData.steps.filter(s => s.status === 'completed').length;
    const progressPercentage = Math.round((completedSteps / progressData.steps.length) * 100);
    
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Timeline */}
            <div className="flex-grow space-y-1 relative lg:w-2/3">
                {progressData.steps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === progressData.steps.length - 1;
                    return (
                        <div key={step.id} className="flex gap-4 items-start">
                             <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    step.status === 'completed' ? 'bg-green-500 shadow-lg' : 
                                    step.status === 'current' ? 'bg-blue-500 shadow-lg ring-4 ring-blue-200' : 
                                    'bg-gray-300'
                                }`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                {!isLast && (
                                    <div 
                                        className={`w-1 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} 
                                        style={{minHeight: step.actionRequired ? '7rem' : '5rem'}}
                                    ></div>
                                )}
                            </div>
                            <div className="pb-8 pt-2 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className={`font-bold text-lg ${step.status === 'current' ? 'text-blue-600' : 'text-slate-800'}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-slate-600 mt-1">{step.description}</p>
                                        {step.completedDate && (
                                            <p className="text-sm text-green-600 mt-2 font-medium">
                                                ✅ Hoàn thành: {formatDateTime(step.completedDate)}
                                            </p>
                                        )}
                                        {step.estimatedDate && step.status === 'pending' && (
                                            <p className="text-sm text-blue-600 mt-2">
                                                🕒 Dự kiến: {formatDate(step.estimatedDate)}
                                            </p>
                                        )}
                                        {step.details && step.details.length > 0 && (
                                            <div className="mt-2">
                                                {step.details.map((detail, i) => (
                                                    <p key={i} className="text-sm text-slate-500">{detail}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Action Button */}
                                {step.actionRequired && step.status === 'current' && (
                                    <div className="mt-4">
                                        <Button 
                                            onClick={() => handlePayment(step.actionPayload)}
                                            disabled={paymentLoading}
                                            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                                        >
                                            {paymentLoading ? (
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                    Đang xử lý thanh toán...
                                                </div>
                                            ) : (
                                                <>
                                                    <CreditCardIcon className="w-4 h-4 mr-2" />
                                                    {step.actionText}
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-slate-500 mt-2">
                                            ID: {booking.id} | VNPay, MoMo, Banking
                                        </p>
                                        {paymentError && (
                                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                                <AlertCircleIcon className="w-4 h-4 inline mr-1" />
                                                {paymentError}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Overview */}
            <div className="lg:w-1/3">
                <Card className="sticky top-24">
                    <CardHeader>
                        <h3 className="!font-bold text-slate-800">Tổng Quan Tiến Trình</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <p className="text-5xl font-bold text-blue-600 mb-2">{progressPercentage}%</p>
                            <p className="text-slate-500">Hoàn thành</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Bước hiện tại:</span>
                                <span className="font-medium">{completedSteps + 1 > progressData.steps.length ? progressData.steps.length : completedSteps + 1}/{progressData.steps.length}</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="font-medium text-blue-800">
                                    {progressData.steps.find(s => s.status === 'current')?.title}
                                </p>
                            </div>
                            {progressData.expectedResultDate && (
                                <div className="pt-3 border-t">
                                    <p className="text-slate-600">
                                        <strong>Dự kiến có kết quả:</strong>
                                    </p>
                                    <p className="font-medium text-green-600">
                                        {formatDate(progressData.expectedResultDate)}
                                    </p>
                                </div>
                            )}
                            {progressData.trackingNumber && (
                                <div className="pt-3 border-t">
                                    <p className="text-slate-600">
                                        <strong>Mã theo dõi:</strong>
                                    </p>
                                    <p className="font-mono text-blue-600 font-medium">
                                        {progressData.trackingNumber}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* --- Feedback Section --- */}
                        {booking.status === 'completed' && (
                          <div className="pt-4 mt-4 border-t">
                            
                            {feedbackSuccess ? (
                              <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-center">
                                <p className="font-semibold text-green-800">{feedbackSuccess}</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <p className="font-bold text-slate-800">Đánh giá của bạn</p>
                                  <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <StarIcon
                                        key={star}
                                        className={`w-6 h-6 cursor-pointer transition-colors ${
                                          rating >= star ? 'text-yellow-400 fill-yellow-400 stroke-black' : 'text-gray-300'
                                        }`}
                                        onClick={() => setRating(star)}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label htmlFor="comment" className="text-sm font-medium text-slate-600">Bình luận</label>
                                  <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="mt-1 w-full p-2 border rounded-md min-h-[80px] focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Chia sẻ cảm nhận của bạn về dịch vụ..."
                                  />
                                </div>
                                {feedbackError && (
                                  <p className="text-sm text-red-600">{feedbackError}</p>
                                )}
                                <Button 
                                  onClick={handleFeedbackSubmit}
                                  disabled={isSubmittingFeedback}
                                  className="w-full bg-blue-500 !text-white hover:bg-blue-600"
                                >
                                  {isSubmittingFeedback ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                     </CardContent>
                 </Card>
             </div>
         </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="fixed z-50 w-full">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-28 bg-blue-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/>
            </svg>
          </div>
          <div className="relative z-10 container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">
                      Trang Chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/booking-list" className="text-blue-600 hover:text-blue-800">
                      Danh Sách Đặt Lịch
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="font-semibold text-blue-900">Trạng Thái Đơn Hẹn</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">
                  Trạng Thái Đơn Hẹn
                  <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                    Theo Dõi Tiến Trình Xét Nghiệm
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-relaxed md:text-lg text-gray-700 mb-4">
                  Theo dõi chi tiết tiến trình xét nghiệm ADN của bạn từ khi đăng ký đến lúc nhận kết quả.
                </p>
                
                {/* Status Badge */}
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig[booking.status].color}`}>
                    <StatusIcon className="w-5 h-5" />
                    {statusConfig[booking.status].label}
                  </div>
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">Mã đơn:</span> #{booking.id.slice(-8)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8 flex border-b">
            <button 
              onClick={() => setActiveTab('detail')} 
              className={`px-4 py-3 font-semibold transition-colors duration-200 ${
                activeTab === 'detail' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Chi Tiết Đơn Hẹn
            </button>
            <button 
              onClick={() => setActiveTab('progress')} 
              className={`px-4 py-3 font-semibold transition-colors duration-200 ${
                activeTab === 'progress' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Theo Dõi Tiến Trình
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'detail' ? renderDetailTab() : renderProgressTab()}
          </div>
        </main>
        
        {/* Floating Action Buttons (Mobile) */}
        <div className="fixed bottom-20 right-4 md:hidden flex flex-col gap-3">
          <Button
            onClick={() => navigate('/booking-list')}
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => navigate(`/edit-booking/${booking.id}`)}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <EditIcon className="w-5 h-5" />
          </Button>
        </div>
        
        {/* ChatBot */}
        <div className="fixed bottom-4 right-4">
          <ChatbotAI />
        </div>
        
        <Footer />
      </div>
    </div>
  );
};