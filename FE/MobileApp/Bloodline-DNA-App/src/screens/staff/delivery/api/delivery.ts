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

export const completeDelivery = async (
  id: string,
  formData: FormData
): Promise<void> => {
  const token =
    (await AsyncStorage.getItem("token")) ||
    (await AsyncStorage.getItem("accessToken"));

  await axios.put(`${STAFF_BASE_URL}/logistics/${id}/complete`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// export const getDeliveryLogisticById = async (id: string): Promise<DeliveryOrder> => {
//   const res = await axios.get(`${BASE_URL}/api/logistics/${id}`, getAuthHeaders());
//   return res.data.data;
// };


// Hàm PUT: Cập nhật trạng thái đặt lịch xét nghiệm
// http://173.208.142.11:8084/api/TestBooking/31DBB33BABCE4237/status?newStatus=6
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