import rootApi from "../../../apis/rootApi";
import type { TestKitRequest, TestKitResponse } from "../types/testKit";

// Hàm POST: Tạo test kit
export const createTestKitApi = async (data: TestKitRequest, token: string): Promise<TestKitResponse> => {
    try {
        const jsonData = {
            bookingId: data.bookingId,
            shippedAt: data.shippedAt,
            receivedAt: data.receivedAt,
            sentToLabAt: data.sentToLabAt,
            labReceivedAt: data.labReceivedAt,
            note: data.note,
            sampleCount: data.sampleCount,
        };
        const response = await rootApi.post("/TestKit", jsonData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as TestKitResponse;
    } catch (error) {
        throw error;
    }
};

// Hàm GET: Lấy danh sách TestKit
export const getTestKitsApi = async (token: string): Promise<TestKitResponse[]> => {
    try {
        const response = await rootApi.get<{ data: TestKitResponse[] }>("/TestKit", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Hàm GET: Lấy danh sách TestKit
export const getTestKitsByIdApi = async (token: string, id: string): Promise<TestKitResponse[]> => {
    try {
        const response = await rootApi.get<{ data: TestKitResponse[] }>(`/TestKit/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Hàm DELETE: Xóa test kit
export const deleteTestKitApi = async (id: string): Promise<void> => {
  try {
    await rootApi.delete(`/TestKit/${id}`);
  } catch (error) {
    if (error instanceof Error) {
        console.error("Lỗi khi gọi getSessionsByTestKitIdApi:", error.message);
      } else {
        console.error("Lỗi không xác định:", error);
      }
      throw error;
  }
};
