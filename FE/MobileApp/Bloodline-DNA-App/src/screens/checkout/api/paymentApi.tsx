import rootApi from "@/api/rootApi";
import type { CallbackRequest, CallbackResponse, CheckoutResponse,} from "../types/checkout";

/**
 * Khởi tạo thanh toán (đặt cọc) cho Booking.
 */
export const checkoutApi = async ( bookingId: string, token: string): Promise<CheckoutResponse> => {
  try {
    const res = await rootApi.post(`/Payment/mobile/${bookingId}/checkout`, {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("📦 API response:", res.data); // 👈 LOG THỰC TẾ

    // Nếu res.data đã là object CheckoutResponse
    if (res.data && res.data.checkoutUrl) {
      return res.data;
    }

    // Nếu là res.data.data (nested response)
    if (res.data?.data?.checkoutUrl) {
      return res.data.data;
    }

    throw new Error("Invalid response from checkout API");
  } catch (error) {
    console.error("checkoutApi error:", error);
    throw error;
  }
};



/**
 * Thanh toán phần còn lại.
 */
export const remainingPaymentApi = async ( bookingId: string, token: string): Promise<CheckoutResponse> => {
  try {
    const res = await rootApi.post(`/Payment/mobile/${bookingId}/remaining-payment`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📦 remainingPaymentApi response:", res.data);

    if (res.data && res.data.checkoutUrl) {
      return res.data;
    }

    if (res.data?.data?.checkoutUrl) {
      return res.data.data;
    }

    throw new Error("Invalid response from remaining-payment API");
  } catch (error) {
    throw error;
  }
};


/**
 * Gửi callback sau khi thanh toán đặt cọc.
 */
export const callbackApi = async ( payload: CallbackRequest, token: string): Promise<CallbackResponse> => {
  try {
    const res = await rootApi.post<{ data: CallbackResponse }>("/Payment/callback", payload,
      {
       headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      responseType: "text",
      transformResponse: [(data) => {
        try {
          return JSON.parse(data);
        } catch (e) {
          return data; 
        }
      }],
    });
    console.log("📥 Server response:", res.data);
    return res.data.data;
  } catch (err: any) {
    console.error("callbackApi error:", err?.response?.data || err.message);
    throw new Error("Invalid response from callback API");
  }
};

/**
 * Gửi callback sau khi thanh toán phần còn lại.
 */
export const remainingCallbackApi = async (bookingId: string, payload: CallbackRequest,token: string): Promise<CallbackResponse> => {
  try {
    const res = await rootApi.post<{ data: CallbackResponse }>(`/Payment/${bookingId}/remaining-callback`,payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.data?.data) {
      throw new Error("Invalid response from remaining-callback API");
    }
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách booking đã đặt cọc và đã nhận mẫu.
 */
export const getDepositedWithSampleReceivedApi = async (token: string): Promise<string[]> => {
  try {
    const res = await rootApi.get<{ data: string[] }>("/Payment/deposited-with-sample-received",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.data?.data) {
      throw new Error("Invalid response from deposited-with-sample-received API");
    }

    return res.data.data;
  } catch (error) {
    console.error("getDepositedWithSampleReceivedApi error:", error);
    throw error;
  }
};
