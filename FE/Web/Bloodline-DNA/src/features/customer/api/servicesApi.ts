import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

// ===== INTERFACES =====
// API Response interfaces matching the backend structure
export interface TestService {
  id: string;
  serviceId: string;
  price: number;
  collectionMethod: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testServiceInfor: {
    id: string;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    priceServices: string[];
  };
}

// Service Detail Response interface
export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  priceServices: {
    id: string;
    serviceId: string;
    price: number;
    collectionMethod: number;
    currency: string | null;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    testServiceInfor: {
      id: string;
      name: string;
      description: string;
      category: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      priceServices: any;
      sampleCount: number;
    };
  }[];
  sampleCount: number;
}

export const servicesApi = async () => {
    try {
      // Try multiple token sources
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    sessionStorage.getItem('token') ||
                    sessionStorage.getItem('authToken') ||
                    // Fallback token for testing
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI2MDNCN0Q2OUFFMTgxNzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsYTEyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6IjBkZjM5ZTEwLTRhNTktNDFlMC1hZGIzLTE4OWM1Mjg1Mjg3MCIsImV4cCI6MTc1MDIyNDgwNSwiaXNzIjoieW91cmRvbWFpbi5jb20iLCJhdWQiOiJ5b3VyZG9tYWluLmNvbSJ9.6ucR2Zmu8Ti5hyUUxVmMfytX37uAkfQ86LsKcDtwV-0';
      
      console.log('🚀 Starting servicesApi call...');
      console.log('🔑 Token being used:', token ? `${token.substring(0, 20)}...` : 'No token');
      console.log('📋 API URL:', `${BASE_URL}/ServicePrice/latest`);
      console.log('🌐 Base URL:', BASE_URL);
      
      const response = await axios.get(`${BASE_URL}/ServicePrice/latest`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
  
      console.log('✅ API Response received');
      console.log('📊 Response status:', response.status);
      console.log('📦 Raw API Response:', response.data);
      console.log('📝 Response type:', typeof response.data);
      console.log('🔍 Is array?:', Array.isArray(response.data));
      
      // Handle responses with $values for circular references
      if (response.data && response.data.$values) {
        console.log('🔄 Found $values structure, extracting...');
        return response.data.$values;
      }
      
      // Handle standard array responses
      if (Array.isArray(response.data)) {
        console.log('📋 Direct array response detected');
        return response.data;
      }
      
      // Handle wrapped responses
      if (response.data && typeof response.data === 'object') {
        console.log('📦 Object response detected, checking for data property...');
        if (response.data.data) {
          console.log('🔄 Found data property, extracting...');
          return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        }
      }
      
      console.log('⚠️ Unexpected response structure, returning as-is');
      return response.data;
      
    } catch (error) {
      console.error('❌ servicesApi Error Details:');
      console.error('📍 Error type:', error?.constructor?.name);
      console.error('📄 Full error object:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('🌐 Axios Error Details:');
        console.error('📊 Status Code:', error.response?.status);
        console.error('📝 Status Text:', error.response?.statusText);
        console.error('📦 Response Data:', error.response?.data);
        console.error('🔗 Request URL:', error.config?.url);
        console.error('⚙️ Request Method:', error.config?.method);
        console.error('🔑 Request Headers:', error.config?.headers);
        console.error('⏱️ Error Code:', error.code);
        console.error('💬 Error Message:', error.message);
        
        // Categorize errors with detailed messages
        if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để xem dữ liệu thực từ API.');
        } else if (error.response?.status === 403) {
          throw new Error('Không có quyền truy cập endpoint này. Vui lòng kiểm tra quyền hạn tài khoản.');
        } else if (error.response?.status === 404) {
          throw new Error('Endpoint API không tồn tại. Vui lòng kiểm tra URL API hoặc liên hệ admin.');
        } else if (error.response?.status && error.response.status >= 500) {
          throw new Error('Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Kết nối API quá chậm (timeout). Vui lòng kiểm tra kết nối mạng và thử lại.');
        } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.');
                 } else {
           // Extract server message with more detail
           const serverMessage =
             error.response?.data?.message ||
             error.response?.data?.title ||
             error.response?.data?.error ||
             error.response?.data?.detail ||
             `Lỗi HTTP ${error.response?.status ?? 'Unknown'}: ${error.response?.statusText || 'Không thể kết nối tới API'}`;
           throw new Error(serverMessage);
         }
       } else {
         // Non-Axios errors
         console.error('🚫 Non-Axios Error Details:');
         console.error('💬 Error Message:', (error as Error)?.message);
         console.error('📚 Error Stack:', (error as Error)?.stack);
         
         if (error instanceof TypeError) {
           throw new Error('Lỗi cấu hình API hoặc URL không hợp lệ. Vui lòng liên hệ admin.');
         } else if (error instanceof SyntaxError) {
           throw new Error('Lỗi phân tích dữ liệu từ server. Vui lòng thử lại sau.');
         } else {
           throw new Error(`Lỗi không xác định: ${(error as Error)?.message || 'Unknown error'}. Vui lòng thử lại hoặc liên hệ admin.`);
         }
      }
    }
};

// Get service detail by ID
export const getServiceById = async (serviceId: string): Promise<ServiceDetail> => {
  try {
    // Try multiple token sources
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  // Fallback token for testing
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI2MDNCN0Q2OUFFMTgxNzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsYTEyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6IjBkZjM5ZTEwLTRhNTktNDFlMC1hZGIzLTE4OWM1Mjg1Mjg3MCIsImV4cCI6MTc1MDIyNDgwNSwiaXNzIjoieW91cmRvbWFpbi5jb20iLCJhdWQiOiJ5b3VyZG9tYWluLmNvbSJ9.6ucR2Zmu8Ti5hyUUxVmMfytX37uAkfQ86LsKcDtwV-0';
    
    console.log('🔍 Fetching service detail by ID:', serviceId);
    console.log('📋 API URL:', `${BASE_URL}/TestService/${serviceId}`);
    
    const response = await axios.get(`${BASE_URL}/TestService/${serviceId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    console.log('📦 Raw Service Detail Response:', response.data);
    
    // Handle different response structures
    let serviceDetail: ServiceDetail;
    
    if (response.data?.data) {
      // Response has data wrapper
      serviceDetail = response.data.data;
    } else if (response.data) {
      // Direct response
      serviceDetail = response.data;
    } else {
      throw new Error('Không tìm thấy dữ liệu dịch vụ');
    }
    
    console.log('✅ Service detail loaded successfully:', serviceDetail);
    return serviceDetail;
    
  } catch (error) {
    console.error('❌ Error in getServiceById:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy dịch vụ với ID này');
      } else if (error.response?.status === 401) {
        throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối quá chậm. Vui lòng thử lại sau');
      } else {
        const serverMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          `Lỗi ${error.response?.status}: Không thể tải thông tin dịch vụ`;
        throw new Error(serverMessage);
      }
    } else {
      throw new Error('Lỗi không xác định khi tải thông tin dịch vụ');
    }
  }
};

