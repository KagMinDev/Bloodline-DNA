import { Button, Collapse } from "antd";
import {
  Calendar,
  Dna,
  FileText,
  FlaskConical,
  Lock,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Footer, Header } from "../../components";
import "./custom-styles.css"; // Thêm dòng này vào đầu file component

const { Panel } = Collapse;

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="flex flex-col items-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:flex-row">
          {/* Text Content */}
          <div className="mb-12 text-center md:w-1/2 md:text-left md:mb-0">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
              Kết nối gia đình qua <br />
              <span className="text-blue-600">Xét nghiệm ADN</span>
            </h1>
            <p className="max-w-lg mb-8 text-lg text-gray-600">
              Xác định quan hệ huyết thống với độ chính xác 99.99%. Kết quả
              nhanh, bảo mật tuyệt đối, hỗ trợ tận tình.
            </p>
            <Link to="/register">
              <Button
                type="primary"
                size="large"
                className="px-8 py-3 text-base transition-all bg-blue-600 border-none shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                Đặt lịch xét nghiệm
              </Button>
            </Link>
          </div>

          {/* Illustration */}
          <div className="flex justify-center md:w-1/2">
            <div className="relative">
              <div className="flex items-center justify-center rounded-full w-80 h-80 bg-blue-600/10">
                <svg
                  className="w-48 h-48 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {/* DNA Double Helix with Glow and Rotate */}
                  <defs>
                    <style>
                      {`
                        .dna-glow { 
                          filter: drop-shadow(0 0 12px rgba(37,99,235,0.6));
                          animation: dna-rotate 6s linear infinite;
                        }
                        @keyframes dna-rotate {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}
                    </style>
                  </defs>

                  <g className="dna-glow">
                    <path
                      d="M8 2c0 4-2 6-2 10s2 6 2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="20" r="1.5" fill="currentColor" />

                    <path
                      d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="16" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="20" r="1.5" fill="currentColor" />

                    <line
                      x1="8"
                      y1="4"
                      x2="16"
                      y2="4"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="6"
                      y1="8"
                      x2="18"
                      y2="8"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="8"
                      y1="12"
                      x2="16"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="6"
                      y1="16"
                      x2="18"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="8"
                      y1="20"
                      x2="16"
                      y2="20"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </g>
                </svg>
              </div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-blue-400/20 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-blue-200/20 animate-pulse"></div>
              <div className="absolute w-10 h-10 rounded-full top-1/3 right-1/3 bg-white/10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">
            Vì sao chọn dịch vụ xét nghiệm ADN của chúng tôi?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 text-center transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <ShieldCheck size={40} className="mx-auto mb-4 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Độ chính xác 99.99%
              </h3>
              <p className="text-gray-600">
                Công nghệ phân tích ADN tiên tiến đảm bảo kết quả đáng tin cậy.
              </p>
            </div>
            <div className="p-6 text-center transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <Lock size={40} className="mx-auto mb-4 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Bảo mật tuyệt đối
              </h3>
              <p className="text-gray-600">
                Dữ liệu được mã hóa, tuân thủ tiêu chuẩn bảo mật quốc tế.
              </p>
            </div>
            <div className="p-6 text-center transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <Rocket size={40} className="mx-auto mb-4 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Kết quả nhanh chóng
              </h3>
              <p className="text-gray-600">
                Nhận kết quả trong 3-5 ngày làm việc, hỗ trợ giao tận nơi.
              </p>
            </div>
            <div className="p-6 text-center transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <Users size={40} className="mx-auto mb-4 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Hỗ trợ chuyên gia
              </h3>
              <p className="text-gray-600">
                Đội ngũ tư vấn 24/7, giải đáp mọi thắc mắc về xét nghiệm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-blue-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">
            Quy trình xét nghiệm ADN huyết thống
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/10">
                <Calendar size={32} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                1. Đặt lịch
              </h3>
              <p className="text-gray-600">
                Đăng ký trực tuyến hoặc liên hệ để đặt lịch lấy mẫu.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/10">
                <FlaskConical size={32} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                2. Lấy mẫu
              </h3>
              <p className="text-gray-600">
                Lấy mẫu ADN đơn giản tại cơ sở hoặc tại nhà.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/10">
                <Dna size={32} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                3. Phân tích
              </h3>
              <p className="text-gray-600">
                Mẫu được phân tích trong phòng thí nghiệm hiện đại.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/10">
                <FileText size={32} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                4. Nhận kết quả
              </h3>
              <p className="text-gray-600">
                Kết quả được gửi qua email bảo mật hoặc giao trực tiếp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-white bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Khách hàng nói gì về chúng tôi
          </h2>

          {/* Auto-scrolling testimonials */}
          <div className="relative overflow-hidden testimonial-container">
            <div className="flex gap-6 auto-scroll-container">
              {/* First set of testimonials */}
              {[
                {
                  content:
                    "Dịch vụ rất chuyên nghiệp, kết quả nhanh và bảo mật. Tôi đã xác định được quan hệ huyết thống một cách dễ dàng.",
                  name: "Nguyễn Văn A",
                  location: "Hà Nội",
                  rating: 5,
                },
                {
                  content:
                    "Đội ngũ hỗ trợ rất nhiệt tình, giải đáp mọi thắc mắc. Kết quả chính xác và đáng tin cậy.",
                  name: "Trần Thị B",
                  location: "TP. HCM",
                  rating: 4.5,
                },
                {
                  content:
                    "Quy trình đơn giản, tôi chỉ cần đặt lịch và nhận kết quả qua email. Rất tiện lợi!",
                  name: "Lê Văn C",
                  location: "Đà Nẵng",
                  rating: 5,
                },
                {
                  content:
                    "Rất hài lòng với dịch vụ. Nhân viên tận tình, kết quả chính xác và nhanh chóng.",
                  name: "Võ Thị D",
                  location: "Cần Thơ",
                  rating: 4,
                },
                {
                  content:
                    "Công nghệ hiện đại, quy trình minh bạch. Tôi cảm thấy yên tâm khi sử dụng dịch vụ.",
                  name: "Hoàng Văn E",
                  location: "Hải Phòng",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={`first-${index}`}
                  className="testimonial-card flex-shrink-0 p-6 rounded-lg bg-white/10 backdrop-blur-sm w-80 min-h-[200px] flex flex-col justify-between"
                >
                  <div className="flex mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <AiFillStar key={i} className="text-xl text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-base leading-relaxed text-gray-200">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {[
                {
                  content:
                    "Dịch vụ rất chuyên nghiệp, kết quả nhanh và bảo mật. Tôi đã xác định được quan hệ huyết thống một cách dễ dàng.",
                  name: "Nguyễn Văn A",
                  location: "Hà Nội",
                  rating: 5,
                },
                {
                  content:
                    "Đội ngũ hỗ trợ rất nhiệt tình, giải đáp mọi thắc mắc. Kết quả chính xác và đáng tin cậy.",
                  name: "Trần Thị B",
                  location: "TP. HCM",
                  rating: 4.5,
                },
                {
                  content:
                    "Quy trình đơn giản, tôi chỉ cần đặt lịch và nhận kết quả qua email. Rất tiện lợi!",
                  name: "Lê Văn C",
                  location: "Đà Nẵng",
                  rating: 5,
                },
                {
                  content:
                    "Rất hài lòng với dịch vụ. Nhân viên tận tình, kết quả chính xác và nhanh chóng.",
                  name: "Võ Thị D",
                  location: "Cần Thơ",
                  rating: 4,
                },
                {
                  content:
                    "Công nghệ hiện đại, quy trình minh bạch. Tôi cảm thấy yên tâm khi sử dụng dịch vụ.",
                  name: "Hoàng Văn E",
                  location: "Hải Phòng",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={`second-${index}`}
                  className="testimonial-card flex-shrink-0 p-6 rounded-lg bg-white/10 backdrop-blur-sm w-80 min-h-[200px] flex flex-col justify-between"
                >
                  <div className="flex mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <AiFillStar key={i} className="text-xl text-yellow-400" />
                    ))}
                  </div>{" "}
                  <p className="mb-4 text-base leading-relaxed text-gray-200">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">
            Đội ngũ chuyên gia của chúng tôi
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Chuyên gia"
                className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                TS. Nguyễn Minh
              </h3>
              <p className="text-gray-600">Chuyên gia Di truyền học</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Chuyên gia"
                className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                PGS. Trần Hương
              </h3>
              <p className="text-gray-600">Chuyên gia Phân tích ADN</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Chuyên gia"
                className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                BS. Lê Quang
              </h3>
              <p className="text-gray-600">Tư vấn Huyết thống</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Chuyên gia"
                className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                ThS. Phạm Linh
              </h3>
              <p className="text-gray-600">Chuyên gia Phòng thí nghiệm</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-blue-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">
            Câu hỏi thường gặp
          </h2>
          <Collapse
            accordion
            bordered={false}
            className="bg-white rounded-lg shadow-md"
            expandIcon={({ isActive }) => (
              <MessageSquare
                size={20}
                className={`text-blue-600 transition-transform ${
                  isActive ? "rotate-90" : ""
                }`}
              />
            )}
          >
            <Panel
              header="Xét nghiệm ADN huyết thống có chính xác không?"
              key="1"
            >
              <p className="text-gray-600">
                Có, xét nghiệm của chúng tôi đạt độ chính xác 99.99% nhờ công
                nghệ phân tích ADN tiên tiến và quy trình kiểm soát chất lượng
                nghiêm ngặt.
              </p>
            </Panel>
            <Panel header="Mất bao lâu để nhận kết quả?" key="2">
              <p className="text-gray-600">
                Kết quả thường được gửi trong vòng 3-5 ngày làm việc sau khi
                nhận mẫu, tùy thuộc vào loại xét nghiệm.
              </p>
            </Panel>
            <Panel header="Thông tin của tôi có được bảo mật không?" key="3">
              <p className="text-gray-600">
                Tuyệt đối! Mọi dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn
                quốc tế. Chúng tôi không chia sẻ thông tin với bên thứ ba.
              </p>
            </Panel>
            <Panel header="Cần chuẩn bị gì trước khi lấy mẫu ADN?" key="4">
              <p className="text-gray-600">
                Không cần chuẩn bị đặc biệt. Chỉ cần đến cơ sở hoặc sắp xếp lấy
                mẫu tại nhà theo lịch hẹn.
              </p>
            </Panel>
            <Panel
              header="Xét nghiệm có thể thực hiện cho trẻ em không?"
              key="5"
            >
              <p className="text-gray-600">
                Có, xét nghiệm ADN an toàn cho mọi lứa tuổi, bao gồm trẻ em, với
                quy trình lấy mẫu không xâm lấn.
              </p>
            </Panel>
          </Collapse>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">
            Tin tức & Kiến thức về ADN
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Xét nghiệm ADN huyết thống là gì?
              </h3>
              <p className="mb-4 text-gray-600">
                Tìm hiểu cách xét nghiệm ADN giúp xác định quan hệ cha con, mẹ
                con, hoặc anh em với độ chính xác cao.
              </p>
              <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Đọc thêm →
              </a>
            </div>
            <div className="p-6 transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Bảo mật trong xét nghiệm ADN
              </h3>
              <p className="mb-4 text-gray-600">
                Khám phá cách chúng tôi bảo vệ dữ liệu ADN của bạn với công nghệ
                mã hóa tiên tiến.
              </p>
              <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Đọc thêm →
              </a>
            </div>
            <div className="p-6 transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Ứng dụng của xét nghiệm ADN
              </h3>
              <p className="mb-4 text-gray-600">
                Ngoài huyết thống, xét nghiệm ADN còn được sử dụng trong di
                truyền, y học, và pháp y.
              </p>
              <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Đọc thêm →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 text-white bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Được tin tưởng bởi
          </h2>

          <div className="flex flex-col gap-8 text-center md:flex-row md:justify-between">
            <div className="flex-1">
              <span className="block mb-2 text-5xl font-bold">10K+</span>
              <p className="text-lg">Khách hàng</p>
            </div>
            <div className="flex-1">
              <span className="block mb-2 text-5xl font-bold">50K+</span>
              <p className="text-lg">Xét nghiệm ADN</p>
            </div>
            <div className="flex-1">
              <span className="block mb-2 text-5xl font-bold">100+</span>
              <p className="text-lg">Chuyên gia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-blue-50">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            Sẵn sàng khám phá quan hệ huyết thống?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
            Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo
            mật. Hỗ trợ 24/7 từ đội ngũ chuyên gia.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button
                type="primary"
                size="large"
                className="px-8 py-3 text-base transition-all bg-blue-600 border-none shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                Đặt lịch ngay
              </Button>
            </Link>
            <a href="#contact">
              <Button
                size="large"
                className="px-8 py-3 text-base text-blue-600 transition-all bg-transparent border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Liên hệ chúng tôi
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
