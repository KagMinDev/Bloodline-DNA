import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { useState } from "react";
import {
  addressRules,
  createConfirmPasswordValidator,
  emailRules,
  fullNameRules,
  passwordRules,
  phoneRules,
  termsValidator,
} from "../../../utils/validators/auth";

// Define the type for form data
interface Register {
  FullName: string;
  Email: string;
  Phone: string;
  PasswordHash: string;
  Address: string;
  Role: string;
}

const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  // Handle registration when form is submitted
  const handleRegister = async (values: Register) => {
    const registerData: Register = {
      FullName: values.FullName,
      Email: values.Email,
      Phone: values.Phone,
      PasswordHash: values.PasswordHash,
      Address: values.Address,
      Role: "customer",
    };

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", registerData);
      console.log("Đăng ký thành công", res.data);
      // Optional: Handle redirect or show notification
    } catch (error) {
      console.error("Đăng ký thất bại", error);
      form.setFields([
        {
          name: "Email",
          errors: ["Đăng ký thất bại, vui lòng kiểm tra lại"],
        },
      ]);
    }
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ PasswordHash: value });

    // Check if passwords match
    if (confirmPassword) {
      setPasswordsMatch(confirmPassword === value);
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    const password = form.getFieldValue("PasswordHash");
    setPasswordsMatch(value === password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-2xl">
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
          Đăng Ký Hệ Thống Y Tế
        </h2>
        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="FullName"
            label={<span className="text-sm font-medium text-gray-700">Họ và tên</span>}
            rules={fullNameRules}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập tên đầy đủ. Ví dụ: Nguyễn Văn A"
              className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="Email"
              label={<span className="text-sm font-medium text-gray-700">Email</span>}
              rules={emailRules}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Nhập địa chỉ email"
                className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="Phone"
              label={<span className="text-sm font-medium text-gray-700">Số điện thoại</span>}
              rules={phoneRules}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Nhập số điện thoại"
                className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="Address"
            label={<span className="text-sm font-medium text-gray-700">Địa chỉ</span>}
            rules={addressRules}
          >
            <Input
              prefix={<HomeOutlined className="text-gray-400" />}
              placeholder="Nhập địa chỉ của bạn"
              className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="PasswordHash"
              label={<span className="text-sm font-medium text-gray-700">Mật khẩu</span>}
              rules={passwordRules}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu của bạn"
                onChange={handlePasswordChange}
                className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</span>}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                createConfirmPasswordValidator(form.getFieldValue),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập lại mật khẩu của bạn"
                onChange={handleConfirmPasswordChange}
                className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                status={!passwordsMatch && confirmPassword !== "" ? "error" : ""}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[termsValidator]}
          >
            <Checkbox className="text-gray-600">
              Tôi đồng ý với{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-auto py-6 text-base font-medium bg-blue-600 border-none rounded-lg hover:bg-blue-700"
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Đã có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;