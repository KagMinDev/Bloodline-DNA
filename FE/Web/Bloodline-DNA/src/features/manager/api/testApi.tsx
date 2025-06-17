import rootApi from "../../../apis/rootApi";
import type { TestRequest, TestResponse } from "../types/testService";

// GET: Lấy danh sách dịch vụ
export const getTestsApi = async (token: string): Promise<TestResponse[]> => {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await rootApi.get<{ data: TestResponse[] }>("/TestService", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data?.data) {
        throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
      }
      return response.data.data;
    } catch (error) {
      attempts++;
      const errorDetails = {
        message: error instanceof Error ? error.message : "Unknown error",
        response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
        status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
      };
      console.error("getTestsApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(error instanceof Error ? `Failed to get tests: ${error.message}` : "Failed to get tests: Unknown error");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get tests after retries");
};

// POST: Tạo mới dịch vụ
export const createTestApi = async (data: TestRequest, token: string): Promise<TestResponse> => {
  try {
    const response = await rootApi.post("/TestService", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as TestResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createTestApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to create test: ${error.message}` : 'Failed to create test: Unknown error');
  }
};