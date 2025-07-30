// src/features/customer/api/sampleApi.ts
import rootApi from "../../../apis/rootApi";

export interface SampleInfoPayload {
  kitId: string;
  donorName: string;
  relationshipToSubject: number;
  sampleType: number;
}

export interface SampleInfoResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface TestKitInfo {
  id: string;
  bookingId: string;
  shippedAt?: string;
  receivedAt?: string;
  sentToLabAt?: string;
  labReceivedAt?: string;
  note?: string;
  samples?: string[];
  sampleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestKitResponse {
  success: boolean;
  message: string;
  data?: TestKitInfo;
}

export interface TestSampleInfo {
  id: string;
  kitId: string;
  donorName: string;
  relationshipToSubject: number;
  sampleType: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestSampleResponse {
  success: boolean;
  message: string;
  data?: TestSampleInfo;
}

/**
 * Gets TestKit information by booking ID.
 * @param bookingId - The booking ID to get TestKit for.
 * @returns A promise that resolves to TestKit information.
 */
export const getTestKitByBookingIdApi = async (
  bookingId: string
): Promise<TestKitResponse> => {
  try {
    // Get authentication token
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      null;

    if (!token) {
      console.warn("⚠️ No authentication token found");
      return {
        success: false,
        message: "Yêu cầu đăng nhập để truy cập thông tin TestKit.",
      };
    }

    const response = await rootApi.get(`/TestKit/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: "Lấy thông tin TestKit thành công!",
        data: response.data?.data || response.data,
      };
    }
    throw new Error(response.data?.message || "Lỗi không xác định từ máy chủ.");
  } catch (error: any) {
    console.error("❌ API Error: getTestKitByBookingIdApi failed", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    } else if (error.response?.status === 403) {
      return {
        success: false,
        message: "Không có quyền truy cập thông tin TestKit.",
      };
    } else if (error.response?.status === 404) {
      return {
        success: false,
        message: "Không tìm thấy thông tin TestKit cho booking này.",
      };
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Không thể lấy thông tin TestKit.";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Gets TestSample information by kit ID to check if sample info has been submitted.
 * @param kitId - The kit ID to get TestSample for.
 * @returns A promise that resolves to TestSample information.
 */
export const getTestSampleByKitIdApi = async (
  kitId: string
): Promise<TestSampleResponse> => {
  try {
    // Get authentication token
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      null;

    if (!token) {
      console.warn("⚠️ No authentication token found");
      return {
        success: false,
        message: "Yêu cầu đăng nhập để truy cập thông tin TestSample.",
      };
    }

    const response = await rootApi.get(`/TestSample/kit/${kitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: "Lấy thông tin TestSample thành công!",
        data: response.data?.data || response.data,
      };
    }
    throw new Error(response.data?.message || "Lỗi không xác định từ máy chủ.");
  } catch (error: any) {
    console.error("❌ API Error: getTestSampleByKitIdApi failed", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    } else if (error.response?.status === 403) {
      return {
        success: false,
        message: "Không có quyền truy cập thông tin TestSample.",
      };
    } else if (error.response?.status === 404) {
      console.log(
        "📝 No TestSample found for kit - sample info not submitted yet"
      );
      return {
        success: false,
        message: "Chưa có thông tin mẫu cho kit này.",
      };
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Không thể lấy thông tin TestSample.";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Submits the sample information provided by the customer.
 * @param payload - The sample information.
 * @returns A promise that resolves to a success or error message.
 */
export const submitSampleInfoApi = async (
  payload: SampleInfoPayload
): Promise<SampleInfoResponse> => {
  try {
    // Get authentication token
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      null;

    if (!token) {
      console.warn("⚠️ No authentication token found");
      return {
        success: false,
        message: "Yêu cầu đăng nhập để gửi thông tin mẫu.",
      };
    }

    const response = await rootApi.post("/TestSample/client-create", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: "Gửi thông tin mẫu thành công!",
        data: response.data,
      };
    }
    throw new Error(response.data?.message || "Lỗi không xác định từ máy chủ.");
  } catch (error: any) {
    console.error("❌ API Error: submitSampleInfoApi failed", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    } else if (error.response?.status === 403) {
      return {
        success: false,
        message: "Không có quyền gửi thông tin mẫu.",
      };
    } else if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response?.data?.message || "Thông tin mẫu không hợp lệ.",
      };
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Không thể gửi thông tin mẫu.";
    return {
      success: false,
      message: errorMessage,
    };
  }
};
