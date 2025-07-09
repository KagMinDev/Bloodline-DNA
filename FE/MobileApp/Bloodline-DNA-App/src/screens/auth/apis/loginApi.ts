import axios from "axios";
import { BASE_URL } from "./rootApi";

export interface LoginResponse {
  token: string;
  userName: string;
  role: "Staff" | "Client";
}

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });

    if (response.data.success) {
      const { token, userName, role } = response.data.data;
      return { token, userName, role };
    } else {
      throw new Error(response.data.message || "Đăng nhập thất bại");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Lỗi không xác định từ server";
      throw new Error(message);
    }
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};
