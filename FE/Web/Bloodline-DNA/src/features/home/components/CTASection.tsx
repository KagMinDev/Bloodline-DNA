import { Button } from "antd";
import { useBookingModal } from "../../services/components/BookingModalContext";

const CTASection: React.FC = () => {
  const { openBookingModal } = useBookingModal();
  return (
    <section className="py-12 bg-white md:py-16">
      <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo mật.
      </h2>
      <p className="mb-8 text-sm text-center text-gray-600 md:text-base">
        Hỗ trợ 24/7 từ đội ngũ chuyên gia.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          type="primary"
          size="large"
          className="px-4 py-2 md:px-6 md:py-3"
          onClick={openBookingModal}
        >
          Đặt lịch ngay
        </Button>
      </div>
    </section>
  )
};

export default CTASection;
