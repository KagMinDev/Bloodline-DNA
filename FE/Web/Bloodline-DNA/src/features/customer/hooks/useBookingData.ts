import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { callPaymentCallbackApi } from '../api/checkoutApi';
import type {
  BookingDetail,
  DetailedBookingStatus,
  TestProgressData,
} from '../types/bookingTypes';
import {
  generateProgressData,
  transformApiDataToBookingDetail,
} from '../components/utils/bookingUtils';
import { getBookingByIdApi } from '../api/bookingListApi';
import { getUserInfoApi } from '../api/userApi';
import { checkoutPaymentApi, checkoutRemainingPaymentApi } from '../api/paymentApi';
import { submitFeedbackApi } from '../api/feedbackApi';

const statusNumberMapping: Record<number, DetailedBookingStatus> = {
  0: 'Pending',
  1: 'PreparingKit',
  2: 'DeliveringKit',
  3: 'KitDelivered',
  4: 'WaitingForSample',
  5: 'ReturningSample',
  6: 'SampleReceived',
  7: 'Testing',
  8: 'Completed',
  9: 'Cancelled',
  10: 'StaffGettingSample',
  11: 'CheckIn',
};

const isDetailedBookingStatus = (status: any): status is DetailedBookingStatus =>
  Object.values(statusNumberMapping).includes(status);

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
      const [apiData, userData] = await Promise.all([
        getBookingByIdApi(bookingId),
        getUserInfoApi().catch(() => null),
      ]);

      if (userData?.id) setUserId(userData.id);
      if (!apiData) throw new Error('Không tìm thấy thông tin booking');

      const formatted = transformApiDataToBookingDetail(apiData, setTestServiceId);
      setBooking(formatted);
      setProgressData(generateProgressData(formatted));

      const rawStatus = formatted.status;
      let normalizedStatus: DetailedBookingStatus | null = null;

      if (typeof rawStatus === 'number') {
        normalizedStatus = statusNumberMapping[rawStatus];
      } else if (isDetailedBookingStatus(rawStatus)) {
        normalizedStatus = rawStatus;
      }

      if (normalizedStatus === 'PreparingKit' || normalizedStatus === 'Completed') {
        setPaymentStatus('PAID');
      } else if (normalizedStatus === 'Cancelled') {
        setPaymentError('Thanh toán thất bại');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tải thông tin đặt lịch';
      setError(msg);
      setBooking(null);
      if (msg.includes('Không tìm thấy')) {
        setTimeout(() => navigate('/booking-list'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  const handlePayment = async (payload?: any) => {
    if (!booking?.id) {
      setPaymentError('Không tìm thấy thông tin đặt lịch');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const isRemaining = payload?.type === 'remaining';
      const result = isRemaining
        ? await checkoutRemainingPaymentApi(booking.id)
        : await checkoutPaymentApi(booking.id);

      if (!result.success) throw new Error(result.message || 'Không thể tạo link thanh toán');

      const paymentData = {
        orderCode: result.orderCode,
        bookingId: booking.id,
        isRemainingPayment: isRemaining,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      if (result.paymentUrl || result.checkoutUrl) {
        window.location.href = result.paymentUrl || result.checkoutUrl;
      } else {
        setPaymentStatus('PAID');
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Lỗi thanh toán không xác định');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentCallback = useCallback(async (orderCode: string, status: string) => {
  try {
    const paymentDataStr = localStorage.getItem('paymentData');
    const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;
    const effectiveBookingId = paymentData?.bookingId || bookingId;
    if (!effectiveBookingId) throw new Error('Không tìm thấy bookingId');

    const normalizedStatus = status.toUpperCase() === 'PAID' ? 'PAID' : 'CANCELLED';

    const response = await callPaymentCallbackApi({
      orderCode,
      status: normalizedStatus,
      bookingId: effectiveBookingId,
    });

    if (response.success && response.status === 'PAID') {
      setPaymentStatus('PAID');
    } else {
      setPaymentStatus('CANCELLED');
      setPaymentError('Thanh toán thất bại hoặc bị hủy');
    }

    await fetchBookingData();
    localStorage.removeItem('paymentData');
    return true;
  } catch (err) {
    console.error('❌ Callback Error:', err);
    setPaymentError('Lỗi callback thanh toán');
    return false;
  }
}, [bookingId, fetchBookingData]);

  useEffect(() => {
    const processPaymentReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const orderCode = params.get('orderCode') || params.get('exportCode');
      if (!status || !orderCode) return;

      const success = await handlePaymentCallback(orderCode, status);
      if (success) {
        params.delete('status');
        params.delete('orderCode');
        params.delete('exportCode');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
      }
    };

    processPaymentReturn();
  }, [handlePaymentCallback]);

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
      const res = await submitFeedbackApi({ userId, testServiceId, rating, comment });
      if (res.success) {
        setFeedbackSuccess('Gửi đánh giá thành công!');
        setRating(0);
        setComment('');
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSampleSubmitSuccess = async () => {
    setIsSampleModalOpen(false);
    await fetchBookingData();
  };

  const handleStepAction = (payload: any) => {
    switch (payload?.type) {
      case 'deposit':
      case 'remaining':
        handlePayment(payload);
        break;
      case 'fill_sample_info':
        setIsSampleModalOpen(true);
        break;
      default:
        console.warn('Hành động không được hỗ trợ:', payload?.type);
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
