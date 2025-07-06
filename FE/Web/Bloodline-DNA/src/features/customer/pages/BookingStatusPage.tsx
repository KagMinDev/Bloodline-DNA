import { useState } from 'react';
import { useBookingData } from '../hooks/useBookingData';
import { Footer, Header } from '../../../components';
import { ArrowLeftIcon, EditIcon, XCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { statusConfig } from '../components/bookingStatus/StatusConfig';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../components/ui/Breadcrumb';
import { BookingDetailTab } from '../components/bookingStatus/BookingDetailTab';
import { BookingProgressTab } from '../components/bookingStatus/BookingProgressTab';
import ChatbotAI from '../../chatbotAI/components/ChatbotAI';
import { SampleInfoModal } from '../components/SampleInfoModal';
import { PaymentDebugger } from '../components/PaymentDebugger';

export const BookingStatusPage = (): React.JSX.Element => {
  const {
    booking,
    progressData,
    isLoading,
    error,
    paymentLoading,
    paymentError,
    rating,
    setRating,
    comment,
    setComment,
    isSubmittingFeedback,
    feedbackSuccess,
    feedbackError,
    isSampleModalOpen,
    setIsSampleModalOpen,
    navigate,
    handlePayment,
    handleFeedbackSubmit,
    handleSampleSubmitSuccess,
    handleStepAction,
  } = useBookingData();

  const [activeTab, setActiveTab] = useState<'detail' | 'progress'>('detail');

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
            <h3 className="text-xl font-semibold text-slate-600 mb-2">{error || 'Không tìm thấy lịch hẹn'}</h3>
            <p className="text-slate-500 mb-6">{error ? 'Vui lòng thử lại sau.' : 'Lịch hẹn không tồn tại hoặc đã bị xóa.'}</p>
            <Button onClick={() => navigate('/booking-list')} className="bg-blue-900 hover:bg-blue-800 text-white">Về Danh Sách</Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[booking.status].icon;

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
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
                    <BreadcrumbLink href="/customer/booking-list" className="text-blue-600 hover:text-blue-800">
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
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
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
          <div>
            {activeTab === 'detail' ? (
              <BookingDetailTab
                booking={booking}
                progressData={progressData}
                paymentLoading={paymentLoading}
                paymentError={paymentError}
                handlePayment={handlePayment}
              />
            ) : (
              <BookingProgressTab
                progressData={progressData}
                booking={booking}
                paymentLoading={paymentLoading}
                paymentError={paymentError}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                isSubmittingFeedback={isSubmittingFeedback}
                feedbackSuccess={feedbackSuccess}
                feedbackError={feedbackError}
                handleFeedbackSubmit={handleFeedbackSubmit}
                handleStepAction={handleStepAction}
                isSampleModalOpen={isSampleModalOpen}
                setIsSampleModalOpen={setIsSampleModalOpen}
              />
            )}
          </div>
        </main>
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
        <div className="fixed bottom-4 right-4">
          <ChatbotAI />
        </div>
        <Footer />
      </div>
      <SampleInfoModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        bookingId={booking.id}
        onSubmitSuccess={handleSampleSubmitSuccess}
      />

      {/* Payment Debugger - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && (
        <PaymentDebugger bookingId={booking.id} />
      )}
    </div>
  );
};