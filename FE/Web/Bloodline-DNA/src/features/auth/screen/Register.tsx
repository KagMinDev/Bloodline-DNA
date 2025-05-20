import {
    HomeOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import {
    addressRules,
    createConfirmPasswordValidator,
    emailRules,
    fullNameRules,
    passwordRules,
    phoneRules,
    termsValidator,
} from "../../../utils/validators/auth";
import type { Register } from "../types/auth.types";

export default function RegisterForm() {
  const [form] = Form.useForm();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Xử lý đăng ký khi form được submit
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
      // Optional: chuyển hướng hoặc hiển thị thông báo
    } catch (error) {
      console.error("Đăng ký thất bại", error);
    }
  };
  
  // Xử lý khi mật khẩu thay đổi
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ PasswordHash: value });
    
    // Kiểm tra xem mật khẩu có khớp với confirmPassword không
    if (confirmPassword) {
      setPasswordsMatch(confirmPassword === value);
    }
  };

  // Xử lý khi xác nhận mật khẩu thay đổi
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    const password = form.getFieldValue("PasswordHash");
    setPasswordsMatch(value === password);
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Đăng ký tài khoản
      </h2>
      <Form
        form={form}
        name="register"
        onFinish={handleRegister}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="FullName"
          label="Họ và tên"
          rules={fullNameRules}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Nhập tên đầy đủ. Ví dụ: Nguyễn Văn A"
            className="py-2"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            name="Email"
            label="Email"
            rules={emailRules}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Nhập địa chỉ email"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="Phone"
            label="Số điện thoại"
            rules={phoneRules}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Nhập số điện thoại"
              className="py-2"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="Address"
          label="Địa chỉ"
          rules={addressRules}
        >
          <Input
            prefix={<HomeOutlined className="text-gray-400" />}
            placeholder="Nhập địa chỉ của bạn"
            className="py-2"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            name="PasswordHash"
            label="Mật khẩu"
            rules={passwordRules}
          >
            <Input.Password
              placeholder="Nhập mật khẩu của bạn"
              prefix={<LockOutlined className="text-gray-400" />}
              onChange={handlePasswordChange}
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              createConfirmPasswordValidator(form.getFieldValue),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu của bạn"
              prefix={<LockOutlined className="text-gray-400" />}
              onChange={handleConfirmPasswordChange}
              className="py-2"
              status={!passwordsMatch && confirmPassword !== "" ? "error" : ""}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[termsValidator]}
        >
          <Checkbox>
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
            className="w-full h-auto py-2 bg-blue-600 hover:bg-blue-700"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}