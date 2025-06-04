import { Button } from "antd";
import { Link } from "react-router-dom";

const CTASection: React.FC = () => (
  <section className="py-16 md:py-20 bg-blue-50">
    <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
        Sẵn sàng khám phá quan hệ huyết thống?
      </h2>
      <p className="max-w-2xl mx-auto mb-8 text-sm text-gray-600 md:text-base">
        Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo mật.
        Hỗ trợ 24/7 từ đội ngũ chuyên gia.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link to="/register">
          <Button
            type="primary"
            size="large"
            className="px-4 py-2 md:px-6 md:py-3 md:text-sm"
          >
            Đặt lịch ngay
          </Button>
        </Link>
        <a href="#contact">
          <Button
            size="large"
            className="px-4 py-2 text-blue-600 bg-transparent border-blue-600 md:px-6 md:py-3 md:text-sm hover:bg-blue-600 hover:text-white"
          >
            Liên hệ chúng tôi
          </Button>
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;
