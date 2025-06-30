import rootApi from "../../../apis/rootApi";
import type { TestKitRequest, TestKitResponse, TestKitUpdateRequest } from "../types/testKit";

// GET: Lấy tất cả test kit
export const getAllTestKitApi = async (): Promise<TestKitResponse[]> => {
  const response = await rootApi.get("/TestKit");
  return Array.isArray(response.data) ? response.data : response.data.data || [];
};

// POST: Tạo mới test kit
export const createTestKitApi = async (data: TestKitRequest): Promise<TestKitResponse> => {
  const response = await rootApi.post("/TestKit", data, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.data) {
    throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
  }
  return response.data as TestKitResponse;
};

// PUT: Cập nhật test kit theo id
export const updateTestKitApi = async (data: TestKitUpdateRequest): Promise<TestKitResponse> => {
  if (!data.id) {
    throw new Error("Invalid request: Missing id");
  }
  const response = await rootApi.put(`/TestKit/${data.id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.data) {
    throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
  }
  return response.data as TestKitResponse;
};

// GET: Lấy test kit theo id
export const getTestKitByIdApi = async (id: string): Promise<TestKitResponse> => {
  const response = await rootApi.get<{ data: TestKitResponse }>(`/TestKit/${id}`);
  if (!response.data?.data) {
    throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
  }
  return response.data.data;
};

// DELETE: Xóa test kit theo id
export const deleteTestKitApi = async (id: string): Promise<void> => {
  await rootApi.delete(`/TestKit/${id}`);
};

// GET: Lấy test kit theo bookingId (nếu khác với id)
export const getTestKitByBookingIdApi = async (bookingId: string): Promise<TestKitResponse> => {
  const response = await rootApi.get<{ data: TestKitResponse }>(`/TestKit/${bookingId}`);
  if (!response.data?.data) {
    throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
  }
  return response.data.data;
};