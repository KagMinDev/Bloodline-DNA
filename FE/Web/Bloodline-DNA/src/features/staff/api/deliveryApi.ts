import axios from "axios";
import { STAFF_BASE_URL } from "../../../apis/rootApi";
import type { DeliveryOrder } from "../types/delivery";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAssignedDeliveries = async (): Promise<DeliveryOrder[]> => {
  const res = await axios.get(
    `${STAFF_BASE_URL}/logistics/assigned`,
    getAuthHeaders()
  );
  return res.data;
};

// export const getDeliveryLogisticById = async (id: string): Promise<DeliveryOrder> => {
//   const res = await axios.get(`${BASE_URL}/api/logistics/${id}`, getAuthHeaders());
//   return res.data.data;
// };
