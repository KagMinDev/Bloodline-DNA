import rootApi from "@/api/rootApi";
import type { SampleInfoPayload, SampleInfoResponse, TestKitResponse, TestSampleResponse,} from "../types/sampleInf";

/**
 * Lấy thông tin TestKit theo bookingId.
 */
export const getTestKitByBookingIdApi = async ( bookingId: string, token: string): Promise<TestKitResponse> => {
  try {
    const res = await rootApi.get(`/TestKit/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.data || res.data?.id) {
      return {
        success: true,
        message: "Lấy thông tin TestKit thành công",
        data: res.data.data || res.data,
      };
    }

    throw new Error("Invalid TestKit response");
  } catch (error: any) {
    console.error("getTestKitByBookingIdApi error:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy thông tin TestSample theo kitId.
 */
export const getTestSampleByKitIdApi = async (kitId: string,token: string): Promise<TestSampleResponse> => {
  try {
    const res = await rootApi.get(`/TestSample/kit/${kitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.data || res.data?.id) {
      return {
        success: true,
        message: "Lấy thông tin TestSample thành công",
        data: res.data.data || res.data,
      };
    }

    throw new Error("Invalid TestSample response");
  } catch (error: any) {
    console.error("getTestSampleByKitIdApi error:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Gửi thông tin mẫu từ phía client.
 */
export const submitSampleInfoApi = async ( payload: SampleInfoPayload,token: string): Promise<SampleInfoResponse> => {
  try {
    const res = await rootApi.post("/TestSample/client-create", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.success || res.status === 200) {
      return {
        success: true,
        message: "Gửi thông tin mẫu thành công",
        data: res.data.data || null,
      };
    }

    throw new Error("Submit sample info failed");
  } catch (error: any) {
    console.error("submitSampleInfoApi error:", error?.response?.data || error.message);

    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message || error.message || "Không thể gửi thông tin mẫu.";

    if (status === 401) return { success: false, message: "Hết phiên đăng nhập." };
    if (status === 403) return { success: false, message: "Không có quyền gửi mẫu." };
    if (status === 400) return { success: false, message: msg };

    return { success: false, message: msg };
  }
};
