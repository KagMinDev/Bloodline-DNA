import rootApi from "../../../apis/rootApi";
import type { TestResultRequest, TestResultResponse } from "../types/testResult";

// GET: Lấy tất cả TestResult
export const getAllTestResultApi = async (token: string): Promise<TestResultResponse[]> => {
  try {
    const response = await rootApi.get<{ data: TestResultResponse[] }>("/TestResult", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data ?? [];
  } catch (error) {
    throw error;
  }
};

// GET: Lấy TestResult theo id
export const getTestResultByIdApi = async (id: string, token: string): Promise<TestResultResponse> => {
  try {
    const response = await rootApi.get<{ data: TestResultResponse }>(`/TestResult/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// POST: Tạo mới TestResult
export const createTestResultApi = async (data: TestResultRequest, token: string): Promise<TestResultResponse> => {
  try {
    const response = await rootApi.post<{ data: TestResultResponse }>("/TestResult", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// PUT: Cập nhật TestResult theo id
export const updateTestResultApi = async (data: TestResultRequest, token: string): Promise<TestResultResponse> => {
  try {
    const response = await rootApi.put<{ data: TestResultResponse }>(`/TestResult/${data.id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// DELETE: Xóa TestResult theo id
export const deleteTestResultApi = async (id: string, token: string): Promise<void> => {
  try {
    await rootApi.delete(`/TestResult/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};