// src/features/customer/api/checkoutApi.ts
const BASE_URL = 'https://api.adntester.duckdns.org';

export const callPaymentCallbackApi = async (payload: {
  orderCode: string;
  status: string;
  bookingId: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/api/Payment/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.message || `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Helper function to handle payment return from gateway
 * (Dùng localStorage thay vì sessionStorage)
 */
export const handlePaymentReturn = async (params: URLSearchParams) => {
  const status = params.get('status');
  const orderCode = params.get('orderCode');

  if (!status || !orderCode) {
    return {
      success: false,
      error: {
        code: 'INVALID_PARAMS',
        message: 'Missing status or orderCode in URL parameters',
      },
    };
  }

  // 🔁 Đọc từ localStorage thay vì sessionStorage
  const paymentDataStr = localStorage.getItem('paymentData');
  const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;

  if (!paymentData?.bookingId) {
    return {
      success: false,
      error: {
        code: 'MISSING_BOOKING_ID',
        message: 'No paymentData or bookingId found in localStorage',
      },
    };
  }

  return callPaymentCallbackApi({
    orderCode,
    status,
    bookingId: paymentData.bookingId,
  });
};
