import axios from "axios";
import { BASE_URL } from "../rootApi";

// export const loginApi = async (email: string, password: string) => {
//   console.log("Starting login process with email:", email);
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/auth/login`,
//       {
//         email,
//         password,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Start response:", );
    
//     return response.data;
//     console.log("Login response:", response.data);
    
//   } catch (error) {
//     console.log("Error during login:", error);
    
//     // Nếu là lỗi từ axios
//     if (axios.isAxiosError(error)) {
//       const serverMessage =
//         error.response?.data?.message || "Lỗi không xác định từ server";
//       throw new Error(serverMessage);
//     }
//     // Nếu là lỗi khác (không phải axios)
//     throw new Error("Đã xảy ra lỗi không mong muốn");
//   }
// };


export const loginApi = async (email: string, password: string) => {
  const maxRetries = 3;
  const timeout = 10000;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log(`Login attempt ${attempts + 1}`);

      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: timeout, // 10 seconds
        }
      );

      console.log("Login successful:", response.data);
      return response.data;

    } catch (error) {
      attempts++;

      // Nếu là lỗi timeout thì thử lại
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.warn(`Timeout occurred. Retrying (${attempts}/${maxRetries})...`);
        if (attempts >= maxRetries) {
          throw new Error("Server quá chậm, thử lại sau.");
        }
      } else {
        // Lỗi khác thì dừng luôn
        throw error;
      }
    }
  }
};

/**
 * 
 * @param token get user info by token
 * @description Lấy thông tin người dùng từ token
 * @param token - JWT token của người dùng
 * @returns 
 */
export const getUserInfoApi = async (token: string) => {
  console.log("Fetching user info with token:", token);

  try {
    const response = await axios.get(`${BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User info response:", response.data);
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