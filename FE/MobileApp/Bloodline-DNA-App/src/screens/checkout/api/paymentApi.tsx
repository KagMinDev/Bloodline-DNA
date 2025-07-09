import rootApi from "@/api/rootApi";
import { CallbackRequest, CallbackResponse, CheckoutResponse } from "../types/checkout";

export const CheckoutApi = async (bookingId: string, token: string): Promise<CheckoutResponse> => {
  console.log("CheckoutApi called with bookingId:", bookingId);

  try {
    console.log("🚀 Calling POST /Payment/" + bookingId + "/checkout");

    const response = await rootApi.post<{ data: CheckoutResponse } | CheckoutResponse>(
      `/Payment/${bookingId}/checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ CheckoutApi raw response:", response);

    // if (!response.data) {
    //   throw new Error("No data received from checkout API");
    // }

    // // Handle both response formats
    // let checkoutData: CheckoutResponse;

    // if ((response.data as any).data) {
    //   checkoutData = (response.data as any).data;
    //   console.log("📦 Using wrapped response format");
    // } else {
    //   checkoutData = response.data as CheckoutResponse;
    //   console.log("📦 Using direct response format");
    // }

    // console.log("✅ CheckoutApi processed data:", checkoutData);

    // if (!checkoutData.checkoutUrl) {
    //   throw new Error("No checkout URL received from API");
    // }

    return response;

  } catch (error: any) {
    console.error("❌ CheckoutApi error:", error);

    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      if (error.response.status === 404) {
        throw new Error(`Booking ${bookingId} not found`);
      } else if (error.response.status === 400) {
        throw new Error("Invalid booking for payment");
      }
    }

    throw error;
  }
};

export const RemainingPaymentApi = async (bookingId: string, token: string): Promise<CheckoutResponse> => {
  try {
    const response = await rootApi.post<{ data: CheckoutResponse }>( `/Payment/${bookingId}/remaining-payment`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data?.data) {
      throw new Error("Invalid response from remaining-payment API");
    }

    return response.data.data;
  } catch (error) {
    console.error("postRemainingPaymentApi error:", error);
    throw error;
  }
};

export const CallbackApi = async (payload: CallbackRequest, token: string): Promise<CallbackResponse> => {
  try {
    const response = await rootApi.post<{ data: CallbackResponse }>( "/Payment/callback",payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data?.data) {
      throw new Error("Invalid response from callback API");
    }

    return response.data.data;
  } catch (error) {
    console.error("postCallbackApi error:", error);
    throw error;
  }
};

export const RemainingCallbackApi = async ( payload: CallbackRequest, token: string): Promise<CallbackResponse> => {
  try {
    const response = await rootApi.post<{ data: CallbackResponse }>("/Payment/remaining-callback",payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data?.data) {
      throw new Error("Invalid response from remaining-callback API");
    }

    return response.data.data;
  } catch (error) {
    console.error("postRemainingCallbackApi error:", error);
    throw error;
  }
};

export const getDepositedWithSampleReceivedApi = async ( token: string): Promise<string[]> => {
  try {
    const response = await rootApi.get<{ data: string[] }>("/Payment/deposited-with-sample-received",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data?.data) {
      throw new Error("Invalid response from deposited-with-sample-received API");
    }

    return response.data.data;
  } catch (error) {
    console.error("getDepositedWithSampleReceivedApi error:", error);
    throw error;
  }
};

