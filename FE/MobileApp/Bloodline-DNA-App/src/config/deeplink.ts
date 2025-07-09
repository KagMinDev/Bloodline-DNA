import { Linking } from "react-native";
import { deepLinkService, PaymentCallbackData } from "@/services/DeepLinkService";

export const DEEP_LINK_CONFIG = {
  scheme: "bloodline",

  paths: {
    paymentCallback: "/payment/callback",
    paymentSuccess: "/payment/success",
    paymentError: "/payment/error",
  },

  generateUrl: (path: string, params?: Record<string, string>) => {
    let url = `${DEEP_LINK_CONFIG.scheme}://${path}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return url;
  },

  parseUrl: (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      const params: Record<string, string> = {};

      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return { path, params };
    } catch (error) {
      console.error("❌ Error parsing deep link URL:", error);
      return null;
    }
  },
};

// Export URLs
export const PAYMENT_CALLBACK_URL = DEEP_LINK_CONFIG.generateUrl(
  DEEP_LINK_CONFIG.paths.paymentCallback
);

export const PAYMENT_SUCCESS_URL = DEEP_LINK_CONFIG.generateUrl(
  DEEP_LINK_CONFIG.paths.paymentSuccess
);

export const PAYMENT_ERROR_URL = DEEP_LINK_CONFIG.generateUrl(
  DEEP_LINK_CONFIG.paths.paymentError
);

// ✅ Đăng ký global listener (chạy một lần duy nhất, ví dụ trong App.tsx)
Linking.addEventListener("url", (event) => {
  const parsed = DEEP_LINK_CONFIG.parseUrl(event.url);
  if (!parsed) return;

  const { path, params } = parsed;

  if (path === DEEP_LINK_CONFIG.paths.paymentCallback) {
    const bookingId = params.bookingId;
    const status = params.status;
    const orderCode = params.orderCode;

    if (!bookingId || !status) return;

    const data: PaymentCallbackData = {
      bookingId,
      status,
      orderCode,
    };

    deepLinkService.triggerPaymentCallback(bookingId, data);
  }
});
