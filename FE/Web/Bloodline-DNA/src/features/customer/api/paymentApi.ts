import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

// ===== INTERFACES =====
export interface CheckoutRequest {
  bookingId: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  paymentUrl?: string;
  orderId?: string;
  amount?: number;
  [key: string]: any;
}

// ===== API FUNCTIONS =====
export const checkoutPaymentApi = async (bookingId: string): Promise<CheckoutResponse> => {
  try {
    // Validate input
    if (!bookingId || bookingId.trim() === '') {
      throw new Error('Booking ID không hợp lệ');
    }

    // Get token from multiple sources
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  // Fallback token for testing
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI2MDNCN0Q2OUFFMTgxNzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsYTEyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6IjBkZjM5ZTEwLTRhNTktNDFlMC1hZGIzLTE4OWM1Mjg1Mjg3MCIsImV4cCI6MTc1MDIyNDgwNSwiaXNzIjoieW91cmRvbWFpbi5jb20iLCJhdWQiOiJ5b3VyZG9tYWluLmNvbSJ9.6ucR2Zmu8Ti5hyUUxVmMfytX37uAkfQ86LsKcDtwV-0';
    
    console.log('🚀 Starting payment checkout for booking:', {
      bookingId: bookingId,
      bookingIdLength: bookingId.length,
      bookingIdType: typeof bookingId,
      hasToken: !!token,
      tokenPrefix: token ? token.substring(0, 20) + '...' : 'no token'
    });

    // Try different possible endpoints
    const possibleEndpoints = [
      `${BASE_URL}/Payment/${bookingId}/checkout`,
      `${BASE_URL}/api/Payment/${bookingId}/checkout`,
      `${BASE_URL}/Payment/${bookingId}`,
      `${BASE_URL}/TestBooking/${bookingId}/checkout`,
      `${BASE_URL}/api/TestBooking/${bookingId}/checkout`
    ];

    let lastError: any = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log('🔄 Trying payment endpoint:', endpoint);

        const response = await axios.post(
          endpoint,
          { bookingId }, // Include in body as well
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000, // 15 second timeout for payment
          }
        );

        console.log('✅ Payment checkout success at endpoint:', endpoint);
        console.log('📦 Payment response:', response.data);
        
        // Handle different response structures
        if (response.data && typeof response.data === 'object') {
          // Ensure we have a proper response structure
          const responseData = response.data;
          
          return {
            success: responseData.success !== false, // Default to true unless explicitly false
            message: responseData.message || 'Checkout thành công',
            paymentUrl: responseData.paymentUrl || responseData.url || responseData.redirectUrl,
            orderId: responseData.orderId || responseData.order_id || responseData.id,
            amount: responseData.amount || responseData.totalAmount,
            ...responseData
          };
        }
        
        // Fallback response if data structure is unexpected
        return {
          success: true,
          message: 'Checkout thành công',
          ...response.data
        };

      } catch (endpointError) {
        console.log('❌ Endpoint failed:', endpoint, endpointError);
        lastError = endpointError;
        continue; // Try next endpoint
      }
    }

    // If all endpoints failed, handle the last error
    throw lastError;

  } catch (error) {
    console.error('❌ Payment checkout error:', error);
    console.error('❌ Error details:', {
      message: (error as any)?.message,
      status: (error as any)?.response?.status,
      statusText: (error as any)?.response?.statusText,
      data: (error as any)?.response?.data,
      url: (error as any)?.config?.url
    });
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      
      console.log('📊 Detailed Axios error:', {
        status,
        statusText: error.response?.statusText,
        responseData,
        requestUrl: error.config?.url,
        requestData: error.config?.data
      });

      if (status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (status === 403) {
        throw new Error('Không có quyền thực hiện thanh toán.');
      } else if (status === 404) {
        throw new Error(`Không tìm thấy booking ID "${bookingId}" trong hệ thống. Vui lòng kiểm tra lại thông tin đặt lịch.`);
      } else if (status === 400) {
        const serverMessage = responseData?.message || 
                             responseData?.error ||
                             responseData?.title ||
                             'Thông tin thanh toán không hợp lệ.';
        throw new Error(`Lỗi dữ liệu: ${serverMessage}`);
      } else if (status && status >= 500) {
        throw new Error('Lỗi server thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối thanh toán quá chậm. Vui lòng kiểm tra mạng và thử lại.');
      } else {
        const serverMessage = responseData?.message ||
                             responseData?.error ||
                             responseData?.title ||
                             `Lỗi ${status}: Không thể thực hiện thanh toán`;
        throw new Error(serverMessage);
      }
    } else {
      throw new Error(`Lỗi thanh toán: ${(error as Error)?.message || 'Lỗi không xác định'}`);
    }
  }
};

// Helper function to format payment amount
export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Helper function to calculate deposit (20%)
export const calculateDeposit = (totalAmount: number): number => {
  return Math.round(totalAmount * 0.2);
}; 