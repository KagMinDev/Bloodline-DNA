import React from "react";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/root-stack/stack.types";

type WebViewRouteProp = RouteProp<RootStackParamList, "WebViewScreen">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WebViewScreen = () => {
  const route = useRoute<WebViewRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { url } = route.params;

  console.log("URL in WebViewScreen:", url);

  const extractParam = (url: string, key: string): string | null => {
    const match = url.match(new RegExp(`[?&]${key}=([^&#]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Lấy paymentType từ URL ban đầu
  const initialPaymentType = extractParam(url, "paymentType") ?? undefined;
  console.log("Initial paymentType from URL:", initialPaymentType);

  const navigateToResult = (
    type: "success" | "error",
    { bookingId, orderCode, paymentType }: { bookingId?: string; orderCode?: string; paymentType?: string }
  ) => {
    // Sử dụng initialPaymentType nếu paymentType từ URL trả về là undefined
    const paymentTypeSafe: "deposit" | "remaining" | "full_payment" =
      paymentType === "remaining" || initialPaymentType === "remaining"
        ? "remaining"
        : paymentType === "full_payment" || initialPaymentType === "full_payment"
          ? "full_payment"
          : "deposit";
    console.log(
      "Extracted paymentType:",
      paymentType,
      ", Initial paymentType:",
      initialPaymentType,
      "-> paymentTypeSafe:",
      paymentTypeSafe
    );

    if (!bookingId) {
      console.log("Booking ID is missing, cannot navigate.");
      return;
    }

    if (type === "success") {
      console.log("Navigating to PaymentSuccess with params:", { bookingId, orderCode, paymentType: paymentTypeSafe });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentSuccess",
            params: {
              bookingId,
              orderCode,
              paymentType: paymentTypeSafe,
            },
          },
        ],
      });
    } else {
      console.log("Navigating to PaymentError with params:", {
        bookingId,
        orderCode,
        paymentType: paymentTypeSafe,
        message: "Thanh toán đã bị hủy.",
      });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentError",
            params: {
              bookingId,
              orderCode,
              paymentType: paymentTypeSafe,
              message: "Thanh toán đã bị hủy.",
            },
          },
        ],
      });
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const currentUrl = navState.url;
    console.log("Current WebView URL:", currentUrl);

    const rawBookingId = extractParam(currentUrl, "bookingId");
    const orderCode = extractParam(currentUrl, "orderCode");
    const paymentType = extractParam(currentUrl, "paymentType") ?? undefined;

    console.log("Extracted params:", { rawBookingId, orderCode, paymentType });

    if (!rawBookingId) {
      console.log("Booking ID is missing in URL:", currentUrl);
      return;
    }

    if (currentUrl.includes("status=PAID")) {
      console.log("Payment successful, navigating to success screen.");
      navigateToResult("success", {
        bookingId: rawBookingId,
        orderCode: orderCode ?? undefined,
        paymentType,
      });
    } else if (currentUrl.includes("status=CANCELLED")) {
      console.log("Payment cancelled, navigating to error screen.");
      navigateToResult("error", {
        bookingId: rawBookingId,
        orderCode: orderCode ?? undefined,
        paymentType,
      });
    }
  };

  return <WebView source={{ uri: url }} onNavigationStateChange={handleNavigationStateChange} />;
};

export default WebViewScreen;