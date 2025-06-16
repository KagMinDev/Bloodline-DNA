import rootApi from "../../../apis/rootApi";
import type { UserRequest, UserResponse } from "../types/User";

export const createStaffApi = async (data: UserRequest, token: string): Promise<UserResponse> => {
  try {
    const response = await rootApi.post<UserResponse>(
      "/admin/create-staff",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
    };
    console.error("createStaffApi error:", errorDetails);
    throw new Error(error instanceof Error ? `Failed to create staff: ${error.message}` : "Failed to create staff: Unknown error");
  }
};

// API lấy danh sách người dùng
export const getAllUserApi = async (token: string): Promise<UserResponse[]> => {
  const maxRetries = 3;
  const timeout = 10000; // 10 seconds
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
        console.log(`Attempt ${attempts + 1} to fetch all users`);

      const response = await rootApi.get<UserResponse[]>("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout, // Thêm timeout 10s cho mỗi request
      });
      return response.data;
    } catch (error) {
      attempts++;
      const errorDetails = {
        message: error instanceof Error ? error.message : "Unknown error",
        response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
        status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
      };
      console.error("getAllUserApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(error instanceof Error ? `Failed to get all users: ${error.message}` : "Failed to get all users: Unknown error");
      }
      // Optional: thêm delay giữa các lần retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get all users after retries");
};