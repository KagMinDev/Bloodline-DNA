import type { ProgressStep } from '../../types/bookingTypes';
import { Button } from '../ui/Button';
import { FilePenIcon, CreditCardIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

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
  bookingId = ''
}: ProgressStepProps) => {
  const Icon = step.icon;

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
        {step.id === 3 && bookingStatus.toLowerCase() === 'kitdelivered' && handleConfirmDelivery && (
          <div className="mt-4">
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
          </div>
        )}
        {step.id === 4 && step.status === 'current' && ['waitingforsample', 'returningsample'].includes(bookingStatus.toLowerCase()) && (
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
      </div>
    </div>
  );
};