import { Button, Form, Input } from "antd";
import { Heart, Mail, Shield, Unlock, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { emailRules } from "../../../utils/validators/auth";

interface ForgotPasswordData {
  Email: string;
}

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  // Handle forgot password request
  const handleForgotPassword = async (values: ForgotPasswordData) => {
    setLoading(true);
    try {
      // Giả lập gửi yêu cầu đặt lại mật khẩu để kiểm tra loading
      console.log("Dữ  giả:", values);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập thời gian chờ 1.5s
      // Nếu muốn dùng API thực, bỏ comment đoạn dưới và comment đoạn trên
      /*
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        values
      );
      console.log("Yêu cầu đặt lại mật khẩu thành công:", response.data);
      */
      form.resetFields(); // Xóa form sau khi gửi thành công
    } catch (error) {
      console.error("Gửi yêu cầu thất bại:", error);
      form.setFields([
        {
          name: "Email",
          errors: ["Gửi yêu cầu thất bại, vui lòng kiểm tra lại"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side - Medical Image/Illustration */}
      <div className="relative flex items-center justify-center flex-1 p-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
          {/* Medical Cross Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                <svg
                  className="w-12 h-12 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {/* DNA Double Helix */}
                  <defs>
                    <style>
                      {`
                        .dna-strand1 { animation: dna-rotate 4s linear infinite; }
                        .dna-strand2 { animation: dna-rotate 4s linear infinite reverse; }
                        @keyframes dna-rotate {
                          0% { transform: rotateY(0deg); }
                          100% { transform: rotateY(360deg); }
                        }
                      `}
                    </style>
                  </defs>

                  {/* Left DNA Strand */}
                  <g className="dna-strand1">
                    <path
                      d="M8 2c0 4-2 6-2 10s2 6 2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="20" r="1.5" fill="currentColor" />
                  </g>

                  {/* Right DNA Strand */}
                  <g className="dna-strand2">
                    <path
                      d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="16" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="20" r="1.5" fill="currentColor" />
                  </g>

                  {/* Connecting Lines */}
                  <line
                    x1="8"
                    y1="4"
                    x2="16"
                    y2="4"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="6"
                    y1="8"
                    x2="18"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="8"
                    y1="12"
                    x2="16"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="6"
                    y1="16"
                    x2="18"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="8"
                    y1="20"
                    x2="16"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                </svg>
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 bg-green-400 rounded-full -top-2 -right-2">
                <Heart size={16} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold">Khôi Phục Tài Khoản</h1>
          <p className="mb-8 text-xl text-blue-100">
            Lấy lại quyền truy cập hệ thống y tế của bạn
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Shield size={20} />
              <span>Bảo mật thông tin tuyệt đối</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Heart size={20} />
              <span>Hỗ trợ khôi phục nhanh chóng</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Users size={20} />
              <span>Đội ngũ hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* Decorative medical elements */}
        <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse"></div>
        <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-green-400/20 animate-pulse"></div>
        <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15"></div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <Unlock size={24} className="text-blue-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Quên Mật Khẩu
            </h2>
            <p className="text-gray-600">
              Nhập email để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {/* Forgot Password Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleForgotPassword}
            className="space-y-6"
            disabled={loading}
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="text-sm font-semibold text-gray-700">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </span>
              }
              name="Email"
              rules={emailRules}
            >
              <Input
                size="large"
                placeholder="Nhập email của bạn"
                prefix={<Mail size={15} className="mr-0.5 text-gray-400" />}
                className="border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full py-3 text-base font-semibold transition-all bg-blue-600 border-none rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                {loading ? "Đang xử lý..." : "Gửi Yêu Cầu"}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-600">
              Quay lại{" "}
              <Link
                to="/login"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
            <p className="mb-4 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Hỗ trợ 24/7</span>
              <span>•</span>
              <span>Bảo mật SSL</span>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <Loading
          fullScreen={true}
          message="Đang gửi yêu cầu đặt lại mật khẩu..."
          size="large"
          color="blue"
        />
      )}
    </div>
  );
};

export default ForgotPassword