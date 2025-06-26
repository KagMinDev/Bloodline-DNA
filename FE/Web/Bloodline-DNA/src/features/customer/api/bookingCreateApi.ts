// Interface cho request body
export interface CreateBookingRequest {
  testServiceId: string;
  clientId?: string; // Make clientId optional since we might not have real user ID
  appointmentDate: string; // ISO date string
  note: string;
  clientName: string;
  address: string;
  phone: string;
  email?: string; // Add email as optional field in case API needs it
}

// Interface cho response (có thể customize dựa trên actual response)
export interface CreateBookingResponse {
  id: string;
  message: string;
  success: boolean;
  // Thêm các field khác nếu cần
}

// Import userApi to get current user info
import { getUserInfoApi } from './userApi';

// Base API URL
const API_BASE_URL = "https://api.adntester.duckdns.org/api";

// Cache for user ID to avoid multiple API calls
let cachedUserId: string | null = null;
let userIdCacheTime: number = 0;
const USER_ID_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function để lấy current user ID từ API
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedUserId && (now - userIdCacheTime) < USER_ID_CACHE_DURATION) {
      console.log('✅ Using cached user ID:', cachedUserId);
      return cachedUserId;
    }
    
    console.log('🔍 Fetching current user ID from API...');
    const userInfo = await getUserInfoApi();
    
    if (userInfo && userInfo.id) {
      console.log('✅ Got user ID from API:', userInfo.id);
      // Cache the result
      cachedUserId = userInfo.id;
      userIdCacheTime = now;
      return userInfo.id;
    } else {
      console.warn('⚠️ No user ID in API response:', userInfo);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to get user ID from API:', error);
    return null;
  }
};

// Function để lấy auth token (có thể từ localStorage, sessionStorage, hoặc context)
const getAuthToken = (): string | null => {
  // TODO: Implement proper token retrieval based on your auth system
  // For now, check common storage locations
  return localStorage.getItem('authToken') || 
         localStorage.getItem('token') || 
         localStorage.getItem('accessToken') ||
         sessionStorage.getItem('authToken') ||
         sessionStorage.getItem('token') ||
         null;
};

// Function để lấy danh sách TestService khả dụng (for debugging and validation)
export const getAvailableTestServicesApi = async (): Promise<any[]> => {
  try {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/TestService`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.warn('Failed to fetch TestServices:', response.status);
      return [];
    }

    const result = await response.json();
    console.log('Available TestServices:', result);
    return result.data || result || [];
  } catch (error) {
    console.error('Error fetching TestServices:', error);
    return [];
  }
};

// Test function để validate API requirements
export const testBookingApiRequirements = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Send minimal test request to see what error we get
    const testRequest = {
      testServiceId: "260E89FC4D096078", // Use known good ID
      appointmentDate: new Date().toISOString(),
      note: "test",
      clientName: "Test User",
      address: "Test Address",
      phone: "1234567890",
      email: "test@test.com"
    };
    
    console.log('Testing API with minimal request:', testRequest);
    
    const response = await fetch(`${API_BASE_URL}/TestBooking`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testRequest),
    });

    const responseText = await response.text();
    console.log('Test API response status:', response.status);
    console.log('Test API response:', responseText);
    
    return {
      status: response.status,
      response: responseText,
      ok: response.ok
    };
  } catch (error) {
    console.error('Test API error:', error);
    return { error: error };
  }
};

// Function để tạo booking
export const createBookingApi = async (bookingData: CreateBookingRequest): Promise<CreateBookingResponse> => {
  try {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/TestBooking`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
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
          
          // Try to get inner exception details if available
          if (errorData.innerException || errorData.details) {
            detailedMessage += ` Details: ${errorData.innerException || errorData.details}`;
          }
        }
        
        console.log('Parsed error data:', errorData);
      } catch (parseError) {
        // If not JSON, use raw text
        detailedMessage = errorData || 'Unknown error';
        console.log('Error parsing response as JSON:', parseError);
      }
      
      // Specific error handling for 401
      if (response.status === 401) {
        throw new Error(`Unauthorized: Please login to continue. Status: ${response.status}`);
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${detailedMessage}`);
    }

    const result: CreateBookingResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Helper function để format date cho API
export const formatDateForApi = (date: Date): string => {
  return date.toISOString();
};

// Mapping từ UI service selection sang actual TestService IDs trong database
const getTestServiceIdMapping = (selectedService: any, serviceType: string): string | null => {
  // Prioritize testServiceInfo.id if available
  if (selectedService?.testServiceInfo?.id) {
    console.log('Using testServiceInfo.id as testServiceId:', selectedService.testServiceInfo.id);
    return selectedService.testServiceInfo.id;
  }
  
  // Nếu selectedService đã có testServiceId thực, return luôn
  if (selectedService?.testServiceId) {
    return selectedService.testServiceId;
  }
  
  // Check for other possible testServiceInfo structures
  if (selectedService?.testServiceInfo) {
    const testServiceInfo = selectedService.testServiceInfo;
    const testServiceId = testServiceInfo.testServiceId || 
                         testServiceInfo.serviceId || 
                         testServiceInfo.id;
    if (testServiceId) {
      console.log('Using testServiceInfo field as testServiceId:', testServiceId);
      return testServiceId;
    }
  }
  
  // Temporary solution: Use selectedService.id directly (as fallback)
  // TODO: Implement proper mapping when you have the actual TestService IDs
  if (selectedService?.id && selectedService.id !== 'temp-id') {
    console.log('Fallback: Using selectedService.id as testServiceId:', selectedService.id);
    return selectedService.id;
  }
  
  // Mapping logic dựa trên category và serviceType (for future use)
  const category = selectedService?.category;
  
  if (category === 'civil') {
    if (serviceType === 'home') {
      // Map to actual TestService IDs for civil home services
      // TODO: Replace with actual TestService IDs from your database
      return selectedService?.testServiceInfo?.id || selectedService?.id || 'civil-home-test-service-id'; // Replace with real ID
    } else if (serviceType === 'clinic') {
      // Map to actual TestService IDs for civil clinic services
      return selectedService?.testServiceInfo?.id || selectedService?.id || 'civil-clinic-test-service-id'; // Replace with real ID
    }
  } else if (category === 'legal') {
    if (serviceType === 'home') {
      return selectedService?.testServiceInfo?.id || selectedService?.id || 'legal-home-test-service-id'; // Replace with real ID
    } else if (serviceType === 'clinic') {
      return selectedService?.testServiceInfo?.id || selectedService?.id || 'legal-clinic-test-service-id'; // Replace with real ID
    }
  }
  
  // Fallback: return the original selectedService.id
  return selectedService?.testServiceInfo?.id || selectedService?.id || null;
};

// Helper function để tạo booking data từ form data
export const mapFormDataToBookingRequest = async (
  formData: any,
  selectedService: any,
  clientId?: string
): Promise<CreateBookingRequest> => {
  console.log('=== VALIDATION START ===');
  console.log('Input formData:', formData);
  console.log('Input selectedService:', selectedService);
  console.log('Input clientId:', clientId);
  
  // Validate required fields
  if (!formData.preferredDate || !formData.preferredTime) {
    console.error('❌ Missing date/time:', { date: formData.preferredDate, time: formData.preferredTime });
    throw new Error('Missing required date/time information');
  }
  
  if (!formData.name || !formData.phone) {
    console.error('❌ Missing contact info:', { name: formData.name, phone: formData.phone });
    throw new Error('Missing required contact information');
  }
  
  if (!formData.email) {
    console.error('❌ Missing email:', formData.email);
    throw new Error('Missing required email information');
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    console.error('❌ Invalid email format:', formData.email);
    throw new Error('Invalid email format');
  }
  
  // Validate phone format (basic)
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
    console.error('❌ Invalid phone format:', formData.phone);
    throw new Error('Invalid phone number format');
  }
  
  // Validate name (no numbers, min length)
  if (formData.name.trim().length < 2) {
    console.error('❌ Name too short:', formData.name);
    throw new Error('Name must be at least 2 characters');
  }
  
  console.log('✅ Basic validation passed');
  
  // Combine date và time thành ISO string với local timezone
  const dateTimeString = `${formData.preferredDate}T${formData.preferredTime}:00`;
  
  // Parse as local time and convert to UTC properly
  const [datePart, timePart] = dateTimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Create date in local timezone
  const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
  
  // Validate date
  if (isNaN(appointmentDateTime.getTime())) {
    console.error('❌ Invalid date object:', appointmentDateTime);
    throw new Error('Invalid date/time format');
  }
  
  // Validate date is in the future
  const now = new Date();
  if (appointmentDateTime <= now) {
    console.error('❌ Date in past:', { appointmentDateTime, now });
    throw new Error('Appointment date must be in the future');
  }
  
  // Validate date is not too far in future (1 year max)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  if (appointmentDateTime > oneYearFromNow) {
    console.error('❌ Date too far in future:', appointmentDateTime);
    throw new Error('Appointment date cannot be more than 1 year in advance');
  }
  
  console.log('✅ Date validation passed');
  
  // Get the actual TestService ID using mapping
  let testServiceId = getTestServiceIdMapping(selectedService, formData.serviceType);
  
  // If mapping failed, try fallback methods
  if (!testServiceId) {
    testServiceId = selectedService?.testServiceId || 
                   selectedService?.serviceId || 
                   selectedService?.id ||
                   formData.testType;
  }
  
  // Ensure testServiceId is not null
  if (!testServiceId) {
    console.error('❌ No testServiceId found:', {
      selectedService,
      formDataTestType: formData.testType,
      mappingResult: testServiceId
    });
    throw new Error('Unable to determine TestService ID. Please select a valid service.');
  }
  
  // Validate testServiceId format (should be GUID-like)
  const guidRegex = /^[0-9A-F]{16}$/i;
  if (!guidRegex.test(testServiceId)) {
    console.error('❌ Invalid testServiceId format:', testServiceId);
    throw new Error('Invalid service ID format. Please try selecting the service again.');
  }
  
  console.log('✅ TestServiceId validation passed:', testServiceId);
  
  // Get real clientId from API instead of localStorage
  let realClientId = clientId || getUserClientId(); // Try provided or localStorage first
  
  // If no clientId from storage, try to get from API
  if (!realClientId || realClientId === 'default-client-id' || realClientId === 'temp-client-id') {
    console.log('🔄 No valid clientId from storage, fetching from API...');
    realClientId = await getCurrentUserId();
  }
  
  console.log('ClientId resolution:', {
    providedClientId: clientId,
    storageClientId: getUserClientId(),
    apiClientId: realClientId,
    finalClientId: realClientId,
    willIncludeClientId: !!realClientId
  });
  
  // Build request object conditionally
  const bookingRequest: CreateBookingRequest = {
    testServiceId: testServiceId, // Now guaranteed to be string
    appointmentDate: formatDateForApi(appointmentDateTime),
    note: (formData.notes || "").trim(),
    clientName: formData.name.trim(),
    address: (formData.address || "").trim(),
    phone: formData.phone.replace(/\s/g, ''), // Remove spaces from phone
    email: formData.email.trim().toLowerCase(),
  };
  
  // Include clientId if we have one (API requires it)
  if (realClientId) {
    bookingRequest.clientId = realClientId;
    console.log('✅ Including clientId in request:', realClientId);
  } else {
    console.warn('⚠️ No clientId available - API may reject this request');
    // API requires clientId, so we should throw an error
    throw new Error('Unable to get user ID. Please make sure you are logged in.');
  }
  
  // Validate final request object
  console.log('=== FINAL REQUEST VALIDATION ===');
  
  // Check required fields are not empty after trimming
  if (!bookingRequest.testServiceId || bookingRequest.testServiceId.length < 10) {
    console.error('❌ Invalid testServiceId in final request:', bookingRequest.testServiceId);
    throw new Error('Invalid service ID in request');
  }
  
  if (!bookingRequest.clientName || bookingRequest.clientName.length < 2) {
    console.error('❌ Invalid clientName in final request:', bookingRequest.clientName);
    throw new Error('Invalid client name in request');
  }
  
  if (!bookingRequest.phone || bookingRequest.phone.length < 10) {
    console.error('❌ Invalid phone in final request:', bookingRequest.phone);
    throw new Error('Invalid phone number in request');
  }
  
  if (!bookingRequest.email || !bookingRequest.email.includes('@')) {
    console.error('❌ Invalid email in final request:', bookingRequest.email);
    throw new Error('Invalid email in request');
  }
  
  if (!bookingRequest.appointmentDate || !bookingRequest.appointmentDate.includes('T')) {
    console.error('❌ Invalid appointmentDate in final request:', bookingRequest.appointmentDate);
    throw new Error('Invalid appointment date format in request');
  }
  
  console.log('✅ Final request validation passed');
  console.log('📤 Final booking request:', JSON.stringify(bookingRequest, null, 2));
  
  return bookingRequest;
};

// Helper function để lấy clientId
const getUserClientId = (): string | null => {
  // Try to get client ID from various sources
  return localStorage.getItem('clientId') || 
         localStorage.getItem('userId') || 
         sessionStorage.getItem('clientId') ||
         sessionStorage.getItem('userId') ||
         null;
}; 