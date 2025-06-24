// api/testBookingApi.ts
import rootApi from "../../../apis/rootApi";
import type { TestBookingResponse, TestBookingStatusRequest } from "../types/testBooking";

// Hàm GET: Lấy danh sách đặt lịch xét nghiệm
export const getTestBookingApi = async (token: string): Promise<TestBookingResponse[]> => {
  try {
    const response = await rootApi.get<{
      success: boolean;
      data: TestBookingResponse[];
      message: string;
      statusCode: number;
    }>("/TestBooking", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Full API response:", response);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Invalid response structure");
    }

    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Hàm GET: Lấy chi tiết đặt lịch xét nghiệm theo ID
export const getTestBookingByIdApi = async (id: string, token: string): Promise<TestBookingResponse> => {
  const timeout = 10000;
  try {
    const response = await rootApi.get<{ data: TestBookingResponse }>(`/TestBooking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout,
    });
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
    };
    console.error("getTestBookingByIdApi error:", errorDetails);
    throw new Error(
      error instanceof Error
        ? `Failed to get test booking: ${error.message}`
        : "Failed to get test booking: Unknown error"
    );
  }
};

// Hàm PUT/PATCH: Cập nhật trạng thái đặt lịch xét nghiệm
// https://api.adntester.duckdns.org/api/TestBooking/2929BD388FF34838/status?newStatus=8
export const updateTestBookingStatusApi = async (request: TestBookingStatusRequest, token: string): Promise<TestBookingResponse> => {
  const maxRetries = 3;
  const timeout = 10000;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await rootApi.put<{ data: TestBookingResponse }>(`/TestBooking/${request.bookingId}/status?newStatus=${request.status}`, {
        status: request.status,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout,
        }
      );
      if (!response.data?.data) {
        throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
      }
      return response.data.data;
    } catch (error) {
      attempts++;
      const errorDetails = {
        message: error instanceof Error ? error.message : "Unknown error",
        response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
        status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
      };
      console.error("updateTestBookingStatusApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(
          error instanceof Error
            ? `Failed to update test booking status: ${error.message}`
            : "Failed to update test booking status: Unknown error"
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to update test booking status after retries");
};