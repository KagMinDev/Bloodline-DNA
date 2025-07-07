import rootApi from "@/api/rootApi";
import type { TestBookingRequest, TestBookingResponse } from "../types/testBooking";
import AsyncStorage from "@react-native-async-storage/async-storage";

// POST: Tạo lịch xét nghiệm
export const createTestBookingApi = async ( data: TestBookingRequest): Promise<TestBookingResponse> => {
    console.log("createTestBookingApi data:", data);
    
    const token = await AsyncStorage.getItem("token");
  console.log("createTestBookingApi token:", token);
  
  try {
    const response = await rootApi.post<TestBookingResponse>("/TestBooking", data,
        {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error) {
    console.error("createTestBookingApi error:", error);
    throw error;
  }
};

// GET: Lấy lịch xét nghiệm theo ID
export const getTestBookingByIdApi = async (id: string): Promise<TestBookingResponse> => {
  const token = AsyncStorage.getItem("token") || "";
  try {
    const response = await rootApi.get<{ data: TestBookingResponse }>(`/TestBooking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    console.error("getTestBookingByIdApi error:", error);
    throw error;
  }
};

