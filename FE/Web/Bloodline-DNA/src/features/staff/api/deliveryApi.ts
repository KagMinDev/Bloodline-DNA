import axios from "axios";
import rootApi, { STAFF_BASE_URL } from "../../../apis/rootApi";
import type { DeliveryOrder, TestBookingStatusRequest } from "../types/delivery";
import type { TestBookingResponse } from "../types/testBooking";

export const getAssignedDeliveries = async (): Promise<DeliveryOrder[]> => {
  // Sử dụng axios trực tiếp với STAFF_BASE_URL vì đây là endpoint khác
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const res = await axios.get(`${STAFF_BASE_URL}/logistics/assigned`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.data && Array.isArray(res.data)) {
    return res.data;
  }

  if (res.data?.data && Array.isArray(res.data.data)) {
    return res.data.data;
  }

  console.error("❌ Invalid data format from API:", res.data);
  return []; // fallback tránh crash
};

// ✅ Hoàn tất đơn
export const completeDelivery = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  await axios.put(
    `${STAFF_BASE_URL}/logistics/${id}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Hàm PUT: Cập nhật trạng thái đặt lịch xét nghiệm
// https://api.adntester.duckdns.org/api/TestBooking/31DBB33BABCE4237/status?newStatus=6
export const updateTestBookingStatusStaff = async (request: TestBookingStatusRequest): Promise<TestBookingResponse> => {
  console.log("Updating booking status:", request.bookingId, "to status:", request.status);

  // rootApi sẽ tự động thêm Authorization header thông qua interceptor
  const response = await rootApi.put<{ data: TestBookingResponse }>(
    `/TestBooking/${request.bookingId}/status?newStatus=${request.status}`,
    {} // empty body
  );
  return response.data.data;
};