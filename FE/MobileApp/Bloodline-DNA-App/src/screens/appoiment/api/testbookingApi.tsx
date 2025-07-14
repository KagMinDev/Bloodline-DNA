import rootApi from "@/api/rootApi";
import type { TestBookingRequest, TestBookingResponse } from "../types/testBooking";
import AsyncStorage from "@react-native-async-storage/async-storage";

// POST: Tạo lịch xét nghiệm
export const createTestBookingApi = async (data: TestBookingRequest): Promise<TestBookingResponse> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  try {
    const response = await rootApi.post<{ data: TestBookingResponse } | TestBookingResponse>(
      "/TestBooking",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data) {
      throw new Error("No data received from server");
    }
    let bookingData: TestBookingResponse | string;
    if ((response.data as any).data) {
      bookingData = (response.data as any).data;
    } else if (typeof response.data === 'string') {
      return {
        id: response.data as string,
        testServiceId: data.testServiceId,
        clientId: data.clientId || "",
        email: "",
        appointmentDate: data.appointmentDate,
        status: "Pending",
        note: data.note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as TestBookingResponse;
    } else {
      bookingData = response.data as TestBookingResponse;
    }
    if (typeof bookingData === 'object' && !bookingData.id) {
      throw new Error("Invalid booking data: missing ID");
    }
    return bookingData as TestBookingResponse;
  } catch (error: any) {
      throw error;
  }
};

// GET: Lấy lịch xét nghiệm theo ID
export const getTestBookingByIdApi = async (id: string): Promise<TestBookingResponse> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  try {
    const response = await rootApi.get<{ data: TestBookingResponse } | TestBookingResponse>(
      `/TestBooking/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.data) {
      throw new Error("No data received from server");
    }
    let bookingData: TestBookingResponse;

    if ((response.data as any).data) {
      bookingData = (response.data as any).data;
    } else {
      bookingData = response.data as TestBookingResponse;
    }
    if (!bookingData.id) {
      throw new Error("Invalid booking data: missing ID");
    }
    return bookingData;
  } catch (error: any) {
      throw error;
  }
};

// GET: Lấy lịch xét nghiệm theo người dùng 
export const getBookingsByUserIdApi = async (userId: string): Promise<TestBookingResponse[]> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  try {
    const response = await rootApi.get<{ data: TestBookingResponse[] } | TestBookingResponse[]>(
      `/TestBooking/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.data) {
      throw new Error("No data received from server");
    }
    let bookingData: TestBookingResponse[];
    if ((response.data as any).data) {
      bookingData = (response.data as any).data;
    } else {
      bookingData = response.data as TestBookingResponse[];
    }
    return bookingData;
  } catch (error: any) {
      throw error;
  }
};

