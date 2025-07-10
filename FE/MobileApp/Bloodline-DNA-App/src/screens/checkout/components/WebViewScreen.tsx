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

  const extractParam = (url: string, key: string): string | null => {
    const match = url.match(new RegExp(`[?&]${key}=([^&#]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const navigateToResult = (
    type: "success" | "error",
    { bookingId, orderCode, paymentType }: { bookingId: string; orderCode?: string; paymentType?: string }
  ) => {
    const paymentTypeSafe = paymentType === "remaining" ? "remaining" : "deposit";

    if (!bookingId) return;

    if (type === "success") {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentSuccess" as const,
            params: {
              bookingId,
              orderCode,
              paymentType: paymentTypeSafe,
            },
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentError" as const,
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

  const rawBookingId = extractParam(currentUrl, "bookingId");
  const orderCode = extractParam(currentUrl, "orderCode");
const paymentType = extractParam(currentUrl, "paymentType") ?? undefined;

  if (!rawBookingId) return; // ✅ Tránh lỗi khi bookingId null

  if (currentUrl.includes("status=PAID")) {
    navigateToResult("success", {
      bookingId: rawBookingId,
      orderCode: orderCode ?? undefined,
      paymentType,
    });
  } else if (currentUrl.includes("status=CANCELLED")) {
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
