import axios from "axios";
import type { TestResultResponse } from "../../staff/types/testResult";

// Lấy tất cả kết quả xét nghiệm của user theo userId
export const getTestResultsByUserId = async (userId: string): Promise<TestResultResponse[]> => {
  try {
    // Lấy token từ localStorage/sessionStorage
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("Không có token xác thực. Vui lòng đăng nhập lại.");
    }
    
    // console.log('🔍 Calling TestResult API with userId:', userId);
    // console.log('🔑 Using token:', token.substring(0, 20) + '...');
    
    const response = await axios.get(`https://api.adntester.duckdns.org/api/TestResult/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    // console.log('✅ TestResult API response:', response.data);
    
    if (Array.isArray(response.data)) {
      // console.log('📊 Found', response.data.length, 'test results');
      return response.data;
    }
    
    console.warn('⚠️ Unexpected response format:', response.data);
    return [];
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy kết quả xét nghiệm:", error);
    
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 404) {
      throw new Error("Không tìm thấy kết quả xét nghiệm cho người dùng này.");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("Kết nối quá chậm. Vui lòng thử lại.");
    } else {
      throw new Error(`Lỗi khi lấy kết quả: ${error.message || 'Không xác định'}`);
    }
  }
}; 