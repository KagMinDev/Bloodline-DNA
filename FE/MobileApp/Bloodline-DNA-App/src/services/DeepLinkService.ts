import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CallbackApi, RemainingCallbackApi } from "@/screens/checkout/api/paymentApi";

export interface PaymentCallbackData {
  orderCode: string;
  status: string;
  bookingId: string;
  paymentType?: "deposit" | "remaining";
}

export class DeepLinkService {
  private static instance: DeepLinkService;
  private listeners: Map<string, (data: PaymentCallbackData) => void> = new Map();

  static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService();
    }
    return DeepLinkService.instance;
  }

  private constructor() {
    this.setupDeepLinkListener();
  }

  private setupDeepLinkListener() {
    // Listen for deep links when app is already running
    Linking.addEventListener("url", this.handleDeepLink);

    // Handle deep link when app is opened from closed state
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeepLink({ url });
      }
    });
  }

  private handleDeepLink = async (event: { url: string }) => {
    try {
      const url = new URL(event.url);
      const pathname = url.pathname;

      // Check if this is a payment callback
      if (pathname.includes("/payment/callback")) {
        await this.handlePaymentCallback(url);
      }
    } catch (error) {
      console.error("Error handling deep link:", error);
    }
  };

  private async handlePaymentCallback(url: URL) {
    try {
      const orderCode = url.searchParams.get("orderCode");
      const status = url.searchParams.get("status");
      const bookingId = url.searchParams.get("bookingId");
      const paymentType = url.searchParams.get("type") as "deposit" | "remaining" | null;

      if (!orderCode || !status || !bookingId) {
        console.error("Missing required payment callback parameters");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found for payment callback");
        return;
      }

      // Call appropriate callback API
      const callbackPayload = { orderCode, status, bookingId };
      
      let result;
      if (paymentType === "remaining") {
        result = await RemainingCallbackApi(callbackPayload, token);
      } else {
        result = await CallbackApi(callbackPayload, token);
      }

      // Notify listeners
      const callbackData: PaymentCallbackData = {
        orderCode,
        status: result.status,
        bookingId: result.bookingId,
        paymentType: paymentType || "deposit",
      };

      this.notifyListeners(bookingId, callbackData);

    } catch (error) {
      console.error("Error processing payment callback:", error);
      
      // Still notify listeners about the error
      const errorData: PaymentCallbackData = {
        orderCode: url.searchParams.get("orderCode") || "",
        status: "ERROR",
        bookingId: url.searchParams.get("bookingId") || "",
        paymentType: (url.searchParams.get("type") as "deposit" | "remaining") || "deposit",
      };

      this.notifyListeners(errorData.bookingId, errorData);
    }
  }

  private notifyListeners(bookingId: string, data: PaymentCallbackData) {
    const listener = this.listeners.get(bookingId);
    if (listener) {
      listener(data);
      // Remove listener after use
      this.listeners.delete(bookingId);
    }
  }

  // Register a listener for payment callbacks for a specific booking
  registerPaymentListener(
    bookingId: string, 
    callback: (data: PaymentCallbackData) => void
  ) {
    this.listeners.set(bookingId, callback);
  }

  // Remove a payment listener
  removePaymentListener(bookingId: string) {
    this.listeners.delete(bookingId);
  }

  // Generate payment URL with callback parameters
  generatePaymentUrl(
    baseUrl: string, 
    bookingId: string, 
    paymentType: "deposit" | "remaining" = "deposit"
  ): string {
    const callbackUrl = `bloodlinedna://payment/callback?bookingId=${bookingId}&type=${paymentType}`;
    
    // Add callback URL as parameter to the payment URL
    const url = new URL(baseUrl);
    url.searchParams.set("returnUrl", callbackUrl);
    
    return url.toString();
  }

  // Clean up all listeners
  cleanup() {
    this.listeners.clear();
    Linking.removeAllListeners("url");
  }
}

// Export singleton instance
export const deepLinkService = DeepLinkService.getInstance();
