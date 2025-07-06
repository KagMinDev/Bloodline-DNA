// Interface cho Booking object từ API response
export interface BookingItem {
  id: string;
  testServiceId: string;
  clientId: string;
  email: string;
  appointmentDate: string; // ISO date string
  price: number;
  collectionMethod: string;
  status: string;
  note: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  clientName: string;
  address: string;
  phone: string;
}

// Interface cho API response wrapper (nếu có)
export interface BookingListResponse {
  success?: boolean;
  data?: BookingItem[];
  message?: string;
  statusCode?: number;
}

// Base API URL
const API_BASE_URL = "https://api.adntester.duckdns.org/api";

// Function để lấy auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || 
         localStorage.getItem('token') || 
         localStorage.getItem('accessToken') ||
         sessionStorage.getItem('authToken') ||
         sessionStorage.getItem('token') ||
         null;
};

// Function để lấy danh sách booking
export const getBookingListApi = async (): Promise<BookingItem[]> => {
  try {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No authentication token found');
      throw new Error('Authentication required. Please login to view bookings.');
    }
    
    console.log('🔍 Fetching booking list from API...');
    
    const response = await fetch(`${API_BASE_URL}/TestBooking`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorData;
      let detailedMessage = '';
      
      try {
        const responseText = await response.text();
        console.log('Raw error response:', responseText);
        
        // Try to parse as JSON
        errorData = JSON.parse(responseText);
        
        // Extract detailed error info
        if (errorData.message) {
          detailedMessage = errorData.message;
        }
        
        console.log('Parsed error data:', errorData);
      } catch (parseError) {
        // If not JSON, use raw text
        detailedMessage = errorData || 'Unknown error';
        console.log('Error parsing response as JSON:', parseError);
      }
      
      // Specific error handling
      if (response.status === 401) {
        throw new Error('Unauthorized: Please login to continue.');
      } else if (response.status === 403) {
        throw new Error('Access denied: You do not have permission to view bookings.');
      } else if (response.status === 404) {
        throw new Error('Booking service not found.');
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${detailedMessage}`);
    }

    const result = await response.json();
    console.log('✅ Booking list fetched successfully:', result);
    
    // Handle different response structures
    if (Array.isArray(result)) {
      // Direct array response
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      // Wrapped response with data property
      return result.data;
    } else if (result.success && result.data && Array.isArray(result.data)) {
      // Standard API wrapper response
      return result.data;
    } else {
      console.warn('Unexpected response structure:', result);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching booking list:', error);
    throw error;
  }
};

// Function để lấy booking theo ID
export const getBookingByIdApi = async (bookingId: string): Promise<BookingItem | null> => {
  try {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication required. Please login to view booking details.');
    }
    
    console.log(`🔍 Fetching booking details for ID: ${bookingId}`);
    
    const response = await fetch(`${API_BASE_URL}/TestBooking/${bookingId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please login to continue.');
      } else if (response.status === 404) {
        throw new Error('Booking not found.');
      }
      
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Booking details fetched successfully:', result);

    // ✅ Ưu tiên trả về result.data nếu có
    if (result?.data) {
      return result.data;
    }

    // Nếu không có .data, mà result là object đúng kiểu BookingDetail
    if (result?.id && result?.status) {
      return result;
    }

    console.warn("⚠️ Unexpected booking response structure:", result);
    return null;
  } catch (error) {
    console.error('❌ Error fetching booking details:', error);
    throw error;
  }
};


// Function để filter booking theo status
export const getBookingsByStatusApi = async (status: string): Promise<BookingItem[]> => {
  try {
    const allBookings = await getBookingListApi();
    
    // Filter bookings by status
    const filteredBookings = allBookings.filter(booking => 
      booking.status.toLowerCase() === status.toLowerCase()
    );
    
    console.log(`✅ Filtered ${filteredBookings.length} bookings with status: ${status}`);
    return filteredBookings;
  } catch (error) {
    console.error('❌ Error filtering bookings by status:', error);
    throw error;
  }
};

// Function để format date cho display
export const formatBookingDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Function để format currency
export const formatPrice = (price: number): string => {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${price}đ`;
  }
};

// Status mapping cho display
export const statusMapping: Record<string, { label: string; color: string }> = {
  'pending': { label: 'Chờ xử lý', color: 'text-yellow-600 bg-yellow-100' },
  'confirmed': { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-100' },
  'in_progress': { label: 'Đang thực hiện', color: 'text-purple-600 bg-purple-100' },
  'completed': { label: 'Hoàn thành', color: 'text-green-600 bg-green-100' },
  'cancelled': { label: 'Đã hủy', color: 'text-red-600 bg-red-100' },
};

// Function để get status display info
export const getStatusDisplay = (status: string) => {
  return statusMapping[status.toLowerCase()] || { 
    label: status, 
    color: 'text-gray-600 bg-gray-100' 
  };
}; 