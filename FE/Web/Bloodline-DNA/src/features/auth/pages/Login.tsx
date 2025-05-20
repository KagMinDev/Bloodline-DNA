import { Button, Form, Input } from "antd";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

// Define the type for form data
interface LoginFormData {
  Email: string;
  PasswordHash: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", data);
      console.log("Đăng nhập thành công:", response.data);
      // Handle redirect, token storage, etc. here
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      form.setFields([
        {
          name: "PasswordHash",
          errors: ["Đăng nhập thất bại, vui lòng kiểm tra lại"],
        },
      ]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="flex justify-center mb-6">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Đăng Nhập Hệ Thống Y Tế
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Email</span>}
            name="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="Nhập email của bạn"
              prefix={<Mail size={20} className="text-gray-400" />}
              className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Mật Khẩu</span>}
            name="PasswordHash"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              prefix={<Lock size={20} className="text-gray-400" />}
              suffix={
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              }
              className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-6 text-base font-medium bg-blue-600 border-none rounded-lg hover:bg-blue-700"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;