import rootApi from "@/api/rootApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UpdateBookingResponse } from "../types/sampleInf";

/**
 * ✅ Xác nhận giao hàng cho booking
 */
export const confirmDeliveryApi = async ( bookingId: string): Promise<UpdateBookingResponse> => {
  
  const token = await AsyncStorage.getItem("token") || "";
  if (!token) throw new Error("Vui lòng đăng nhập để xác nhận giao hàng.");

  try {
    const res = await rootApi.put(`/TestBooking/${bookingId}/confirm-delivery`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.success || res.status === 200) {
      return {
        success: true,
        message: "Xác nhận giao hàng thành công",
        data: res.data?.data || res.data,
      };
    }

    throw new Error("Xác nhận giao hàng thất bại.");
  } catch (error: any) {
    console.error("❌ confirmDeliveryApi error:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔁 Cập nhật trạng thái booking
 */
export const updateBookingStatusApi = async ( bookingId: string, newStatus: number): Promise<UpdateBookingResponse> => {
  const token = await AsyncStorage.getItem("token") || "";
  if (!token) throw new Error("Vui lòng đăng nhập để cập nhật trạng thái.");

  try {
    const res = await rootApi.put(`/TestBooking/${bookingId}/status`, null, {
      headers: { Authorization: `Bearer ${token}` },
      params: { newStatus },
    });

    if (res.data?.success || res.status === 200) {
      return {
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: res.data?.data || res.data,
      };
    }

    throw new Error("Cập nhật trạng thái thất bại.");
  } catch (error: any) {
    throw error;
  }
};

/**
 * 🧪 Xác nhận đã thu mẫu và gửi thời gian
 */
export const confirmCollectionApi = async ( bookingId: string, collectionDateTime: string): Promise<UpdateBookingResponse> => {
  const token = await AsyncStorage.getItem("token") || "";
  if (!token) throw new Error("Vui lòng đăng nhập để xác nhận thu mẫu.");

  try {
    const res = await rootApi.post(`/TestBooking/${bookingId}/confirm-collection`,`"${collectionDateTime}"`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data?.success || res.status === 200) {
      return {
        success: true,
        message: "Xác nhận thu mẫu thành công",
        data: res.data?.data || res.data,
      };
    }

    throw new Error("Xác nhận thu mẫu thất bại.");
  } catch (error: any) {
    console.error("❌ confirmCollectionApi error:", error?.response?.data || error.message);
    throw error;
  }
};
