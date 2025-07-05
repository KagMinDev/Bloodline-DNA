import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingByIdApi } from '../api/bookingListApi';
import { checkoutPaymentApi, checkoutRemainingPaymentApi } from '../api/paymentApi';
import { submitFeedbackApi } from '../api/feedbackApi';
import { getUserInfoApi } from '../api/userApi';
import type { BookingDetail, TestProgressData } from '../types/bookingTypes';
import { generateProgressData, transformApiDataToBookingDetail } from '../components/utils/bookingUtils';
import { updateErrorStatusApi, updateSuccessStatusApi } from '../api/checkoutApi';
import { paymentLogger } from '../utils/paymentLogger';

export const useBookingData = () => {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [progressData, setProgressData] = useState<TestProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [testServiceId, setTestServiceId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchBookingData = useCallback(async () => {
    if (!bookingId) {
      setError('Booking ID không hợp lệ');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch song song booking info và user info
      const [apiData, userData] = await Promise.all([
        getBookingByIdApi(bookingId).catch(err => {
          console.error('Error fetching booking:', err);
          throw new Error('Không tìm thấy đơn đặt lịch');
        }),
        getUserInfoApi().catch(() => null) // Bỏ qua lỗi nếu không lấy được user info
      ]);

      // Xử lý user data
      if (userData?.id) {
        setUserId(userData.id);
      }

      // Xử lý booking data
      if (!apiData) {
        throw new Error('Không tìm thấy thông tin booking');
      }

      const formattedBooking = transformApiDataToBookingDetail(apiData, setTestServiceId);
      setBooking(formattedBooking);
      
      const progress = generateProgressData(formattedBooking);
      setProgressData(progress);

      // Cập nhật trạng thái thanh toán
      if (formattedBooking.status === 'confirmed' || formattedBooking.status === 'completed') {
        setPaymentStatus('PAID');
      } else if (formattedBooking.status === 'cancelled') {
        setPaymentError('Thanh toán thất bại');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải thông tin đặt lịch';
      setError(errorMessage);
      setBooking(null);
      
      // Nếu không tìm thấy booking, điều hướng sau 3 giây
      if (errorMessage.includes('Không tìm thấy')) {
        setTimeout(() => navigate('/booking-list'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, navigate]);

  // Khởi tạo và theo dõi booking data
  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  // Xử lý thanh toán
  const handlePayment = async (payload?: any) => {
  console.log('💳 Starting payment process in useBookingData:', {
    bookingId: booking?.id,
    payload: payload,
    bookingStatus: booking?.status,
    timestamp: new Date().toISOString()
  });

  if (!booking?.id) {
    console.error('❌ No booking ID available for payment');
    setPaymentError('Không tìm thấy thông tin đặt lịch');
    return;
  }

  setPaymentLoading(true);
  setPaymentError(null);

  try {
    const isRemainingPayment = payload?.type === 'remaining' || booking.status === 'finalpayment';

    console.log('🔄 Payment type determined:', {
      isRemainingPayment: isRemainingPayment,
      payloadType: payload?.type,
      bookingStatus: booking.status,
      timestamp: new Date().toISOString()
    });

    const result = isRemainingPayment
      ? await checkoutRemainingPaymentApi(booking.id)
      : await checkoutPaymentApi(booking.id);

    console.log('📦 Payment API result:', {
      success: result.success,
      hasPaymentUrl: !!result.paymentUrl,
      hasCheckoutUrl: !!result.checkoutUrl,
      orderCode: result.orderCode,
      message: result.message,
      timestamp: new Date().toISOString()
    });

    if (!result.success) {
      throw new Error(result.message || 'Không thể tạo link thanh toán');
    }

    if (result.paymentUrl) {
      const redirectData = {
        url: result.paymentUrl,
        orderCode: result.orderCode,
        bookingId: booking.id,
        paymentType: isRemainingPayment ? 'remaining' as const : 'deposit' as const
      };

      console.log('🔗 Redirecting to paymentUrl:', {
        ...redirectData,
        timestamp: new Date().toISOString()
      });

      paymentLogger.logPaymentRedirect(result.paymentUrl, redirectData);

      // Lưu thông tin orderCode vào sessionStorage để xử lý callback khi quay lại
      if (result.orderCode) {
        const pendingPayment = {
          orderCode: result.orderCode,
          bookingId: booking.id,
          isRemainingPayment,
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('pendingPayment', JSON.stringify(pendingPayment));
        console.log('💾 Saved pending payment to sessionStorage:', pendingPayment);
      }
      window.location.href = result.paymentUrl;
    } else if (result.checkoutUrl) {
      console.log('🔗 Redirecting to checkoutUrl:', {
        url: result.checkoutUrl,
        orderCode: result.orderCode,
        timestamp: new Date().toISOString()
      });

      if (result.orderCode) {
        const pendingPayment = {
          orderCode: result.orderCode,
          bookingId: booking.id,
          isRemainingPayment,
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('pendingPayment', JSON.stringify(pendingPayment));
        console.log('💾 Saved pending payment to sessionStorage:', pendingPayment);
      }
      window.location.href = result.checkoutUrl;
    } else {
      console.log('✅ Payment completed without redirect');
      setPaymentStatus('PAID');
    }
  } catch (err) {
    console.error('❌ Payment error in useBookingData:', {
      error: err,
      bookingId: booking.id,
      timestamp: new Date().toISOString()
    });

    const errorMessage = err instanceof Error ? err.message : 'Lỗi thanh toán không xác định';
    setPaymentError(errorMessage.includes('Không tìm thấy')
      ? 'Đơn đặt lịch không tồn tại hoặc đã bị hủy'
      : errorMessage);
  } finally {
    setPaymentLoading(false);
  }
};

const handlePaymentCallback = useCallback(async (orderCode: string, isSuccess: boolean) => {
  console.log('🔄 Processing payment callback:', {
    orderCode: orderCode,
    isSuccess: isSuccess,
    bookingId: bookingId,
    timestamp: new Date().toISOString()
  });

  if (!bookingId) {
    console.error('❌ No booking ID available for callback');
    return;
  }

  try {
    console.log('📞 Calling payment callback API:', {
      orderCode: orderCode,
      isSuccess: isSuccess,
      apiCall: isSuccess ? 'updateSuccessStatusApi' : 'updateErrorStatusApi',
      timestamp: new Date().toISOString()
    });

    const response = isSuccess
      ? await updateSuccessStatusApi(orderCode, bookingId)
      : await updateErrorStatusApi(orderCode, 'FAILED', bookingId);

    console.log('📦 Payment callback API response:', {
      success: response.success,
      error: response.error,
      timestamp: new Date().toISOString()
    });

    if (!response.success) {
      console.error('❌ Callback failed:', response.error?.message);
      return;
    }

    console.log('✅ Payment callback successful, refreshing booking data');
    // Refresh booking data after successful callback
    await fetchBookingData();
  } catch (err) {
    console.error('❌ Error processing payment callback:', {
      error: err,
      orderCode: orderCode,
      isSuccess: isSuccess,
      timestamp: new Date().toISOString()
    });
  }
}, [bookingId, fetchBookingData]);

useEffect(() => {
  const checkPendingPayment = async () => {
    console.log('🔍 Checking for pending payment in sessionStorage');

    const pendingPaymentStr = sessionStorage.getItem('pendingPayment');
    if (!pendingPaymentStr) {
      console.log('📭 No pending payment found in sessionStorage');
      return;
    }

    console.log('📄 Found pending payment in sessionStorage:', pendingPaymentStr);

    const pendingPayment = JSON.parse(pendingPaymentStr);
    if (!pendingPayment.orderCode || !pendingPayment.bookingId) {
      console.log('❌ Invalid pending payment data:', pendingPayment);
      return;
    }

    console.log('✅ Valid pending payment data:', {
      orderCode: pendingPayment.orderCode,
      bookingId: pendingPayment.bookingId,
      isRemainingPayment: pendingPayment.isRemainingPayment,
      timestamp: pendingPayment.timestamp
    });

    // Kiểm tra URL hiện tại có chứa thông báo thành công/không thành công không
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('status');

    console.log('🔍 Checking URL status parameter:', {
      status: status,
      fullUrl: window.location.href,
      searchParams: searchParams.toString(),
      timestamp: new Date().toISOString()
    });

    if (status === 'success' || status === 'cancel') {
      const returnData = {
        status: status,
        isSuccess: status === 'success',
        orderCode: pendingPayment.orderCode,
        bookingId: pendingPayment.bookingId,
        paymentType: pendingPayment.isRemainingPayment ? 'remaining' as const : 'deposit' as const
      };

      console.log('🎯 Payment status detected, processing callback:', {
        ...returnData,
        timestamp: new Date().toISOString()
      });

      paymentLogger.logPaymentReturn(returnData);

      try {
        await handlePaymentCallback(
          pendingPayment.orderCode,
          status === 'success'
        );

        console.log('🗑️ Removing pending payment from sessionStorage');
        // Xóa thông tin pending payment sau khi xử lý
        sessionStorage.removeItem('pendingPayment');

        // Xóa tham số status từ URL
        searchParams.delete('status');
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        console.log('🔄 Updating URL:', {
          oldUrl: window.location.href,
          newUrl: newUrl,
          timestamp: new Date().toISOString()
        });
        window.history.replaceState({}, '', newUrl);
      } catch (err) {
        console.error('❌ Error handling payment callback:', {
          error: err,
          pendingPayment: pendingPayment,
          status: status,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      console.log('⏳ No payment status in URL, keeping pending payment for later check');
    }
  };

  checkPendingPayment();
}, [handlePaymentCallback]);

  // Các hàm xử lý feedback và sample info giữ nguyên
  const handleFeedbackSubmit = async () => {
    if (!userId || !testServiceId) {
      setFeedbackError('Thiếu thông tin người dùng hoặc dịch vụ');
      return;
    }
    if (rating === 0) {
      setFeedbackError('Vui lòng chọn số sao đánh giá');
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackError(null);

    try {
      const response = await submitFeedbackApi({ userId, testServiceId, rating, comment });
      if (response.success) {
        setFeedbackSuccess('Gửi đánh giá thành công!');
        setComment('');
        setRating(0);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSampleSubmitSuccess = async () => {
    setIsSampleModalOpen(false);
    await fetchBookingData(); // Refresh data
  };

  const handleStepAction = (payload: any) => {
    if (!payload?.type) return;

    switch (payload.type) {
      case 'deposit':
      case 'remaining':
        handlePayment(payload);
        break;
      case 'fill_sample_info':
        setIsSampleModalOpen(true);
        break;
      default:
        console.warn('Hành động không được hỗ trợ:', payload.type);
    }
  };

  return {
    booking,
    progressData,
    isLoading,
    error,
    paymentLoading,
    paymentError,
    paymentStatus,
    userId,
    testServiceId,
    rating,
    setRating,
    comment,
    setComment,
    isSubmittingFeedback,
    feedbackSuccess,
    feedbackError,
    isSampleModalOpen,
    setIsSampleModalOpen,
    handlePayment,
    handleFeedbackSubmit,
    handleSampleSubmitSuccess,
    handlePaymentCallback,
    handleStepAction,
    navigate,
    refetchBookingData: fetchBookingData,
  };
};