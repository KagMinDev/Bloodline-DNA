import rootApi from "../../../apis/rootApi";
import type { TestBookingResponse, TestBookingStatusRequest } from "../types/testBooking";


// Hàm GET: Lấy danh sách đặt lịch xét nghiệm
export const getTestBookingApi = async (token: string): Promise<TestBookingResponse[]> => {
  try {
    const response = await rootApi.get<{ data: TestBookingResponse[]; statusCode: number; }>("/TestBooking", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data ?? [];
  } catch (error) {
    throw error;
  }
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
export const updateTestBookingStatusApi = async (request: TestBookingStatusRequest, token: string): Promise<TestBookingResponse> => {
  try {
    const response = await rootApi.put<{ data: TestBookingResponse }>(
      `/TestBooking/${request.bookingId}/status`, { status: request.status },
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