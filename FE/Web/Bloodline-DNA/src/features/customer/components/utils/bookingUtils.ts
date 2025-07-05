import { CalendarIcon, CreditCardIcon, PackageIcon, TruckIcon, FlaskConicalIcon, FileTextIcon, XCircleIcon } from 'lucide-react';
import type { BookingDetail, BookingItem, DetailedBookingStatus, ProgressStep, TestProgressData } from '../../types/bookingTypes';
import { formatPrice } from '../../api/bookingListApi';
import { calculateDeposit, formatPaymentAmount } from '../../api/paymentApi';

export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
export const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const transformApiDataToBookingDetail = (item: BookingItem, setTestServiceId: (id: string | null) => void): BookingDetail => {
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
    if (statusLower.includes('kitdelivered') || statusLower.includes('đãnhậnkit')) return 'kitdelivered';
    if (statusLower.includes('deliveringkit')) return 'deliveringkit';
    if (statusLower.includes('preparingkit')) return 'preparingkit';
    if (statusLower.includes('confirmed') || statusLower.includes('xácnhận')) return 'confirmed';
    if (statusLower.includes('pending') || statusLower.includes('chờ')) return 'pending';
    console.warn(`Unknown booking status from API: "${status}". Defaulting to 'pending'.`);
    return 'pending';
  };

  setTestServiceId(item.testServiceId || null);

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

export const generateProgressData = (booking: BookingDetail): TestProgressData => {
  const baseDate = new Date(booking.bookingDate);
  const bookingStatus = booking.status;

  let steps: ProgressStep[] = [];

  steps.push({
    id: 1,
    title: 'Đăng Ký Lịch Thành Công',
    description: 'Yêu cầu đặt lịch đã được ghi nhận thành công',
    icon: CalendarIcon,
    status: 'completed',
    completedDate: booking.bookingDate,
  });

  if (bookingStatus === 'cancelled') {
    steps.push({
      id: 2,
      title: 'Lịch hẹn đã bị hủy',
      description: 'Lịch hẹn của bạn đã bị hủy do yêu cầu của bạn hoặc lý do khác.',
      icon: XCircleIcon,
      status: 'current',
      completedDate: new Date().toISOString(),
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
  });

  const kitCompletedStatuses: DetailedBookingStatus[] = ['kitdelivered', 'waitingforsample', 'returningsample', 'samplereceived', 'testing', 'completed', 'finalpayment'];
  const kitCurrentStatuses: DetailedBookingStatus[] = ['confirmed', 'preparingkit', 'deliveringkit'];

  let kitStatus: ProgressStep['status'] = 'pending';
  let kitDetails: string[] = [];

  if (kitCompletedStatuses.includes(bookingStatus)) {
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

  const sampleStatuses: DetailedBookingStatus[] = ['samplereceived', 'testing', 'completed', 'finalpayment'];
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