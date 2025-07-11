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
  const res = await axios.get(`${STAFF_BASE_URL}/logistics/assigned`, getAuthHeaders());

  console.log("getAssignedDeliveries", res)
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
  await axios.put(
    `${STAFF_BASE_URL}/logistics/${id}/complete`,
    {},
    getAuthHeaders()
  );
};
