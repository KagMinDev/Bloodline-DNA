import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { HomeIcon, BuildingIcon, CalendarIcon, ClockIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, AlertCircleIcon } from 'lucide-react';
import { calculateDeposit, formatPaymentAmount } from '../../api/paymentApi';
import type { BookingDetail, TestProgressData } from '../../types/bookingTypes';
import { formatDate } from '../utils/bookingUtils';

interface BookingDetailTabProps {
  booking: BookingDetail;
  progressData: TestProgressData | null;
  paymentLoading: boolean;
  paymentError: string | null;
  handlePayment: (payload?: any) => void;
}

export const BookingDetailTab = ({ booking, progressData, paymentLoading, paymentError, handlePayment }: BookingDetailTabProps) => {
  return (
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
};