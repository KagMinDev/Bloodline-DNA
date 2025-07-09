export type PaymentCallbackData = {
  status: string;
  bookingId: string;
  orderCode?: string;
};

type PaymentListener = (data: PaymentCallbackData) => void;

class DeepLinkService {
  private listeners: Record<string, PaymentListener> = {};

  registerPaymentListener(bookingId: string, listener: PaymentListener) {
    this.listeners[bookingId] = listener;
  }

  removePaymentListener(bookingId: string) {
    delete this.listeners[bookingId];
  }

  triggerPaymentCallback(bookingId: string, data: PaymentCallbackData) {
    const listener = this.listeners[bookingId];
    if (listener) {
      listener(data);
    } else {
      console.warn(`⚠️ No listener for bookingId: ${bookingId}`);
    }
  }
}

// ✅ Sau khi class đã đầy đủ, mới export
export const deepLinkService = new DeepLinkService();

