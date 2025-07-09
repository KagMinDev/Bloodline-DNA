import { STAFF_BASE_URL } from "@/api/rootApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DeliveryOrder } from "../types/delivery";

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
  return res.data;
};

export const completeDelivery = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  await axios.put(`${STAFF_BASE_URL}/logistics/${id}/complete`, {}, headers);
};

// export const getDeliveryLogisticById = async (id: string): Promise<DeliveryOrder> => {
//   const res = await axios.get(`${BASE_URL}/api/logistics/${id}`, getAuthHeaders());
//   return res.data.data;
// };
