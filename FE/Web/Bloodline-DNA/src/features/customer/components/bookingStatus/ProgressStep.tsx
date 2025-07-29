import type { ProgressStep } from '../../types/bookingTypes';
import { Button } from '../ui/Button';
import { FilePenIcon, CreditCardIcon, AlertCircleIcon, CheckCircleIcon, CalendarIcon, EyeIcon } from 'lucide-react';
import { getTestResultsByUserId } from '../../api/testResultApi';
import { useState } from 'react';

interface ProgressStepProps {
  step: ProgressStep;
  index: number;
  isLast: boolean;
  paymentLoading: boolean;
  paymentError: string | null;
  handleStepAction: (payload: any) => void;
  bookingStatus: string;
  setIsSampleModalOpen: (open: boolean) => void;
  handleConfirmDelivery?: (bookingId: string) => void;
  confirmDeliveryLoading?: boolean;
  bookingId?: string;
  shouldShowSampleButton: boolean;
  isDeliveryConfirmed: boolean;
  isCollectionConfirmed: boolean;
  userId?: string | null;
}

export const ProgressStepProps = ({ 
  step, 
  isLast, 
  paymentLoading, 
  paymentError, 
  handleStepAction, 
  bookingStatus, 
  setIsSampleModalOpen,
  handleConfirmDelivery,
  confirmDeliveryLoading = false,
  bookingId = '',
  shouldShowSampleButton,
  isDeliveryConfirmed,
  isCollectionConfirmed,
  userId
}: ProgressStepProps) => {
  const Icon = step.icon;
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);

  // Hàm lấy kết quả xét nghiệm
  const handleViewResult = async () => {
    setLoadingResult(true);
    setResultError(null);
    setResultData(null);
    try {
      if (!userId) {
        throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      }
      
      console.log('🔍 Debug info:', {
        userId: userId,
        bookingId: bookingId,
        stepId: step.id
      });
      
      const results = await getTestResultsByUserId(userId);
      console.log('📊 All results:', results);
      
      const matched = results.find(r => r.testBookingId === bookingId);
      console.log('🎯 Matched result:', matched);
      
      if (!matched) {
        console.warn('⚠️ No matching result found. Available testBookingIds:', results.map(r => r.testBookingId));
        throw new Error("Không tìm thấy kết quả cho lịch này. Có thể kết quả chưa được cập nhật.");
      }
      
      setResultData(matched);
      setShowResultModal(true);
    } catch (e: any) {
      console.error('❌ Error in handleViewResult:', e);
      setResultError(e.message || "Lỗi khi lấy kết quả");
    } finally {
      setLoadingResult(false);
    }
  };

  return (
    <div className="flex gap-4 items-start">
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
            style={{ minHeight: step.actionRequired ? '7rem' : '5rem' }}
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
                ✅ Hoàn thành: {new Date(step.completedDate).toLocaleString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            {step.estimatedDate && step.status === 'pending' && (
              <p className="text-sm text-blue-600 mt-2">
                🕒 Dự kiến: {new Date(step.estimatedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
        {step.actionRequired && step.status === 'current' && (
          <div className="mt-4">
            <Button
              onClick={() => handleStepAction(step.actionPayload)}
              disabled={paymentLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            >
              {paymentLoading && (step.actionPayload?.type === 'deposit' || step.actionPayload?.type === 'remaining') ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                <>
                  {step.actionPayload?.type === 'fill_sample_info' ? 
                    <FilePenIcon className="w-4 h-4 mr-2" /> :
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                  }
                  {step.actionText}
                </>
              )}
            </Button>
            {step.actionPayload?.type !== 'fill_sample_info' && (
              <p className="text-xs text-slate-500 mt-2">
                ID: {step.actionPayload?.bookingId} | VNPay, MoMo, Banking
              </p>
            )}
            {paymentError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                <AlertCircleIcon className="w-4 h-4 inline mr-1" />
                {paymentError}
              </div>
            )}
          </div>
        )}
        {step.id === 3 && bookingStatus.toLowerCase() === 'deliveringkit' && handleConfirmDelivery && (
          <div className="mt-4">
            {isDeliveryConfirmed ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-700">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">Cảm ơn bạn đã xác nhận</span>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => handleConfirmDelivery(bookingId)}
                  disabled={confirmDeliveryLoading}
                  className="bg-green-600 hover:bg-green-700 !text-white font-semibold"
                >
                  {confirmDeliveryLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2 text-white" />
                      Đã Nhận Kit
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Xác nhận bạn đã nhận được kit xét nghiệm.
                </p>
              </>
            )}
          </div>
        )}
        {step.id === 4 && bookingStatus.toLowerCase() === 'waitingforsample' && shouldShowSampleButton && (
          <div className="mt-4">
            <Button
              onClick={() => setIsSampleModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold"
            >
              <FilePenIcon className="w-4 h-4 mr-2 text-white" />
              Điền thông tin mẫu
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              Sau khi điền thông tin, bạn có thể gửi mẫu cho chúng tôi.
            </p>
          </div>
        )}
        {step.id === 4 && bookingStatus.toLowerCase() === 'waitingforsample' && !shouldShowSampleButton && (
          <div className="mt-4">
            {isCollectionConfirmed ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-700">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">Đã Xác Nhận Ngày Nhân Viên Đến Lấy Mẫu</span>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => handleStepAction({ type: 'schedule_collection' })}
                  className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold"
                >
                  <CalendarIcon className="w-4 h-4 mr-2 text-white" />
                  Chọn Ngày Giờ Để Nhân Viên Tới Lấy Mẫu
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Đặt lịch hẹn để nhân viên đến tận nơi lấy mẫu xét nghiệm.
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Nút XEM KẾT QUẢ cho step Trả Kết Quả (id = 7) */}
        {step.id === 7 && bookingStatus.toLowerCase() === 'completed' && (
          <div className="mt-4">
            <Button 
              onClick={handleViewResult} 
              disabled={loadingResult} 
              className="bg-green-600 hover:bg-green-700 !text-white flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              {loadingResult ? "Đang tải..." : "XEM KẾT QUẢ"}
            </Button>
            {resultError && (
              <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 border border-red-200 rounded">
                {resultError}
                {resultError.includes("đăng nhập") && (
                  <div className="mt-1">
                    <Button 
                      onClick={() => window.location.href = '/auth/login'} 
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1"
                    >
                      Đăng nhập ngay
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal hiển thị kết quả */}
      {showResultModal && resultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600" onClick={() => setShowResultModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-green-700">Kết Quả Xét Nghiệm</h2>
            <div className="mb-2"><b>Mã booking:</b> {resultData.testBookingId}</div>
            <div className="mb-2"><b>Kết luận:</b> {resultData.resultSummary}</div>
            <div className="mb-2"><b>Ngày trả kết quả:</b> {new Date(resultData.resultDate).toLocaleDateString('vi-VN')}</div>
            <div className="mb-2"><b>Khách hàng:</b> {resultData.client?.fullName} ({resultData.client?.email})</div>
            <div className="mb-2"><b>Địa chỉ:</b> {resultData.client?.address}</div>
            <div className="mb-4">
              <b>File kết quả:</b><br />
              <img src={resultData.resultFileUrl} alt="Kết quả" className="max-w-full max-h-60 border rounded mt-2" />
            </div>
            <Button onClick={() => setShowResultModal(false)} className="w-full bg-green-600 text-white mt-2">Đóng</Button>
          </div>
        </div>
      )}
    </div>
  );
};