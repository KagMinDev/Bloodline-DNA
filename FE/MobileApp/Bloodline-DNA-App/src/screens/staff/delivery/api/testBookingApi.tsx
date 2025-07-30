import rootApi from "@/api/rootApi";
import type { TestBookingResponse, TestBookingStatusRequest } from "../types/testBooking";


// Hàm GET: Lấy danh sách đặt lịch xét nghiệm
export const getTestBookingApi = async (token: string): Promise<TestBookingResponse[]> => {
  const maxRetries = 3;
  const timeout = 10000;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await rootApi.get<{ data: TestBookingResponse[]; statusCode: number; }>(
        "/TestBooking",
        {
          timeout,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      console.error("getTestBookingApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(error instanceof Error ? `Failed to get test bookings: ${error.message}` : "Failed to get test bookings: Unknown error");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get test bookings after retries");
};


// Hàm GET: Lấy chi tiết đặt lịch xét nghiệm theo ID
export const getTestBookingByIdApi = async (id: string, token: string): Promise<TestBookingResponse> => {
  try {
    if (!id) throw new Error("Booking ID is required");

    const response = await rootApi.get<{ data: TestBookingResponse }>(`/TestBooking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Hàm PUT: Cập nhật trạng thái đặt lịch xét nghiệm
// https://api.adntester.duckdns.org/api/TestBooking/31DBB33BABCE4237/status?newStatus=6
export const updateTestBookingStatusApi = async (request: TestBookingStatusRequest, token: string): Promise<TestBookingResponse> => {
  
  try {
    const response = await rootApi.put<{ data: TestBookingResponse }>(
      `/TestBooking/${request.bookingId}/status?newStatus=${request.status}`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};