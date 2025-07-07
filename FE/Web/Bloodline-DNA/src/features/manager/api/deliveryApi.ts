import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";
import type { DeliveryLogistic, DeliveryOrder, DeliveryStatus } from "../types/delivery";

const mapStatus = (status: number): DeliveryStatus => {
  switch (status) {
    case 0: return "PreparingKit";
    case 1: return "DeliveringKit";
    case 2: return "KitDelivered";
    case 3: return "WaitingForPickup";
    case 4: return "PickingUpSample";
    case 5: return "SampleReceived";
    case 6: return "cancelled";
    default: return "cancelled";
  }
};

export const getDeliveryLogistics = async (): Promise<DeliveryOrder[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/Logistic`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.data.success && Array.isArray(response.data.data)) {
    return response.data.data.map((item: DeliveryLogistic) => ({
      id: item.id,
      staff: item.staff?.fullName || "Chưa phân công",
      address: item.address,
      phone: item.phone,
      scheduleAt: item.scheduledAt,
      completeAt: item.completedAt,
      note: item.note,
      status: mapStatus(item.status),
    }));
  } else {
    throw new Error("Dữ liệu không hợp lệ từ server.");
  }
};

export const getDeliveryLogisticById = async (id: string): Promise<DeliveryOrder> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/Logistic/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.data.success && response.data.data) {
    const item: DeliveryLogistic = response.data.data;
    return {
      id: item.id,
      staff: item.staff?.fullName || "Chưa phân công",
      address: item.address,
      phone: item.phone,
      scheduleAt: item.scheduledAt,
      completeAt: item.completedAt,
      note: item.note,
      status: mapStatus(item.status),
    };
  } else {
    throw new Error("Không tìm thấy đơn logistic với ID này.");
  }
};
