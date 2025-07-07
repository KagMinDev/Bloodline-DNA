import axios from "axios";
import { BASE_URL } from "./rootApi";

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    // Nếu là lỗi từ axios
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Lỗi không xác định từ server";
      throw new Error(serverMessage);
    }
    // Nếu là lỗi khác (không phải axios)
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};

export const getUserInfoApi = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Lỗi không xác định từ server";
      throw new Error(serverMessage);
    }
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};