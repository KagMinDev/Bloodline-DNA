import { Button, Form, Input } from "antd";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import type { Login } from "../types/auth.types";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

  const [form] = Form.useForm();

  const handleLogin = async (data: Login) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", data);
      console.log("Đăng nhập thành công:", response.data);
      // Xử lý chuyển hướng, lưu token, v.v. ở đây
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Đăng nhập</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        className="space-y-4"
      >
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            placeholder="Nhập email của bạn"
            prefix={<Mail size={16} className="text-gray-400" />}
            className="py-2"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="PasswordHash"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn"
            prefix={<Lock size={16} className="text-gray-400" />}
            suffix={
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            }
            className="py-2"
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
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
