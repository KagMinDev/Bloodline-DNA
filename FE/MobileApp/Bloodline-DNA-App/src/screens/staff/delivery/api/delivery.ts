import rootApi, { STAFF_BASE_URL } from "@/api/rootApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DeliveryOrder, TestBookingResponse, TestBookingStatusRequest } from "../types/delivery";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAssignedDeliveries = async (): Promise<DeliveryOrder[]> => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${STAFF_BASE_URL}/logistics/assigned`, headers);
  return res.data.data;
};

export const completeDelivery = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  await axios.put(`${STAFF_BASE_URL}/logistics/${id}/complete`, {}, headers);
};

// export const getDeliveryLogisticById = async (id: string): Promise<DeliveryOrder> => {
//   const res = await axios.get(`${BASE_URL}/api/logistics/${id}`, getAuthHeaders());
//   return res.data.data;
// };


// Hàm PUT: Cập nhật trạng thái đặt lịch xét nghiệm
// https://api.adntester.duckdns.org/api/TestBooking/31DBB33BABCE4237/status?newStatus=6
export const updateTestBookingStatusStaff = async (request: TestBookingStatusRequest, token: string): Promise<TestBookingResponse> => {
  
  const response = await rootApi.put<{ data: TestBookingResponse }>(
    `/TestBooking/${request.bookingId}/status?newStatus=${request.status}`,{},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};