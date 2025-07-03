import {
  AlertCircleIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { createBookingApi, mapFormDataToBookingRequest, getAvailableTestServicesApi, testBookingApiRequirements } from "../api/bookingCreateApi";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";

// Define interface locally to avoid import issues
interface CreateBookingResponse {
  id: string;
  message: string;
  success: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (bookingData: BookingData) => void;
  selectedService?: {
    id: string;
    title: string;
    category: string; // 'civil' or 'legal'
    price: string;
    collectionMethod: number; // 0 = home/self, 1 = clinic
    testServiceInfo?: {
      id: string;
      [key: string]: any;
    };
    [key: string]: any; // Allow additional properties
  };
}

interface BookingData {
  serviceType: "home" | "clinic";
  name: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  testType: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedService,
}) => {
  const [formData, setFormData] = useState<BookingData>({
    serviceType: "home",
    name: "",
    phone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    testType: "civil-self",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<CreateBookingResponse | null>(null);
  const [enhancedSelectedService, setEnhancedSelectedService] = useState<any>(null);

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('accessToken') ||
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('token');
    return !!token;
  };

  // Validate testServiceId
  const validateTestServiceId = (): boolean => {
    const serviceToUse = enhancedSelectedService || selectedService;
    const testServiceId = serviceToUse?.testServiceInfo?.id || serviceToUse?.id || formData.testType;
    
    console.log('Validating testServiceId:', {
      serviceToUse,
      testServiceId,
      hasTestServiceInfo: !!serviceToUse?.testServiceInfo
    });
    
    // Check if testServiceId exists and is not an internal code
    if (!testServiceId || 
        testServiceId.includes('civil-') || 
        testServiceId.includes('legal-')) {
      console.warn('Invalid testServiceId for submission:', testServiceId);
      return false;
    }
    
    return true;
  };

  // Update formData when selectedService changes
  React.useEffect(() => {
    if (selectedService) {
      // Determine default service type based on collectionMethod
      let defaultServiceType: 'home' | 'clinic';
      if (selectedService.collectionMethod === 0) {
        defaultServiceType = 'home'; // collectionMethod 0 = Tự thu mẫu / Thu tại nhà
      } else if (selectedService.collectionMethod === 1) {
        defaultServiceType = 'clinic'; // collectionMethod 1 = Thu mẫu tại trung tâm
      } else {
        // Fallback to home if collectionMethod is unexpected or undefined
        console.warn('Unexpected collectionMethod value:', selectedService.collectionMethod);
        defaultServiceType = 'home';
      }
      
      // Set testType to the selected service id
      const defaultTestType = selectedService.id;
      
      console.log('🔧 Setting form data based on collectionMethod:', {
        collectionMethod: selectedService.collectionMethod,
        defaultServiceType,
        defaultTestType
      });
      
      setFormData(prev => ({
        ...prev,
        serviceType: defaultServiceType,
        testType: defaultTestType
      }));
    } else {
      // Reset to default if no selectedService
      setFormData(prev => ({
        ...prev,
        serviceType: 'home',
        testType: 'civil-self'
      }));
    }
  }, [selectedService]);

  // Debug: Fetch available TestServices when modal opens
  React.useEffect(() => {
    if (isOpen) {
      console.log('=== BOOKING MODAL DEBUG ===');
      console.log('selectedService object structure:', selectedService);
      console.log('selectedService.testServiceInfo:', selectedService?.testServiceInfo);
      console.log('selectedService.collectionMethod:', selectedService?.collectionMethod);
      console.log('Does selectedService have testServiceInfo?', !!selectedService?.testServiceInfo);
      console.log('selectedService keys:', selectedService ? Object.keys(selectedService) : 'no selectedService');
      
      console.log('Modal opened, fetching available TestServices for debugging...');
      getAvailableTestServicesApi().then(testServices => {
        console.log('Available TestServices in database:', testServices);
        console.log('Current selectedService:', selectedService);
        
        // Enhance selectedService with testServiceInfo if missing
        let enhancedService = { ...selectedService };
        
        if (selectedService && testServices.length > 0 && !selectedService.testServiceInfo) {
          console.log('🔧 selectedService missing testServiceInfo, attempting to find it...');
          
          // Try to find matching TestService
          const matchingTestService = testServices.find((ts: any) => 
            ts.serviceId === selectedService.id ||
            ts.relatedServiceId === selectedService.id ||
            ts.id === selectedService.id ||
            (ts.name || ts.title || '').toLowerCase().includes((selectedService.title || '').toLowerCase().substring(0, 5))
          );
          
          if (matchingTestService) {
            console.log('✅ Found matching TestService for enhancement:', matchingTestService);
            enhancedService = {
              ...selectedService,
              testServiceInfo: {
                id: matchingTestService.id,
                ...matchingTestService
              },
              // Ensure collectionMethod is preserved
              collectionMethod: selectedService.collectionMethod
            };
            setEnhancedSelectedService(enhancedService);
            console.log('🚀 Enhanced selectedService with testServiceInfo:', enhancedService);
          } else {
            console.warn('❌ Could not find matching TestService for auto-enhancement');
            setEnhancedSelectedService(selectedService);
          }
        } else {
          setEnhancedSelectedService(selectedService);
        }
        
        // Check if selectedService.id exists in available TestServices
        if (selectedService && testServices.length > 0) {
          const selectedServiceId = selectedService?.id;
          const testServiceInfoId = selectedService?.testServiceInfo?.id;
          
          console.log('Checking IDs:', {
            selectedServiceId,
            testServiceInfoId,
            selectedServiceFull: selectedService
          });
          
          const matchingService = testServices.find((ts: any) => 
            ts.id === selectedServiceId || 
            ts.id === testServiceInfoId ||
            ts.serviceId === selectedServiceId ||
            ts.serviceId === testServiceInfoId ||
            ts.testServiceId === selectedServiceId ||
            ts.testServiceId === testServiceInfoId
          );
          
          if (matchingService) {
            console.log('✅ Found matching TestService:', matchingService);
          } else {
            console.warn('❌ No matching TestService found');
            console.warn('selectedService.id:', selectedServiceId);
            console.warn('testServiceInfo.id:', testServiceInfoId);
            console.warn('Available TestService IDs:', testServices.map((ts: any) => ({ 
              id: ts.id, 
              serviceId: ts.serviceId,
              testServiceId: ts.testServiceId,
              name: ts.name || ts.title 
            })));
          }
        }
      }).catch(err => {
        console.error('Failed to fetch TestServices for debugging:', err);
      });
      
      // Test API requirements
      console.log('Testing API requirements...');
      testBookingApiRequirements().then(result => {
        console.log('API requirements test result:', result);
      }).catch(err => {
        console.error('API requirements test failed:', err);
      });
    }
  }, [isOpen, selectedService]);

  interface TestType {
    id: string;
    name: string;
    price: string;
    time: string;
    category: string;
  }

  // Gói xét nghiệm theo category và hình thức thu mẫu
  const testTypesByCategory: Record<string, Record<string, TestType[]>> = {
    civil: {
      home: [
        { id: "civil-self", name: "ADN Dân Sự - Tự Thu Mẫu (Kit)", price: "1.500.000đ", time: "5-7 ngày", category: "Dân sự" },
        { id: "civil-home", name: "ADN Dân Sự - Thu Tại Nhà", price: "2.500.000đ", time: "3-5 ngày", category: "Dân sự" },
      ],
      clinic: [
        { id: "civil-center", name: "ADN Dân Sự - Thu Tại Trung Tâm", price: "2.000.000đ", time: "3-5 ngày", category: "Dân sự" },
      ]
    },
    legal: {
      clinic: [
        { id: "legal-center", name: "ADN Hành Chính - Thu Tại Trung Tâm", price: "3.500.000đ", time: "7-10 ngày", category: "Hành chính" },
        { id: "legal-bone", name: "ADN Hành Chính - Giám Định Hài Cốt", price: "Liên hệ", time: "30+ ngày", category: "Hành chính" },
      ]
    }
  };

  // Lấy gói xét nghiệm duy nhất từ selectedService thay vì tất cả gói available
  const getSelectedServiceAsTestType = (): TestType | null => {
    if (!selectedService) return null;
    
    // Tạo TestType object từ selectedService
    return {
      id: selectedService.id,
      name: selectedService.title,
      price: selectedService.price,
      time: "3-7 ngày", // Default time, có thể customize
      category: selectedService.category === 'civil' ? 'Dân sự' : 'Hành chính'
    };
  };

  // Lấy gói xét nghiệm theo category của service và hình thức thu mẫu đã chọn (giữ để tương thích)
  const getAvailableTestTypes = (): TestType[] => {
    const selectedTest = getSelectedServiceAsTestType();
    return selectedTest ? [selectedTest] : [];
  };

  // Lấy tất cả service types khả dụng cho collectionMethod đã chọn (để validate)
  const getAvailableServiceTypes = (): string[] => {
    if (!selectedService) {
      // Nếu không có selectedService, trả về cả hai option
      return ['home', 'clinic'];
    }
    
    const { collectionMethod } = selectedService;
    
    // Dựa vào collectionMethod để trả về service types khả dụng
    if (collectionMethod === 0) {
      return ['home']; // collectionMethod 0 = chỉ home
    } else if (collectionMethod === 1) {
      return ['clinic']; // collectionMethod 1 = chỉ clinic
    }
    
    // Fallback: nếu collectionMethod không rõ, trả về cả hai
    return ['home', 'clinic'];
  };

  // Đếm số lượng service types có sẵn
  const getAvailableServiceTypesCount = (): number => {
    if (!selectedService) {
      // Nếu không có selectedService, hiển thị cả hai option
      return 2;
    }
    
    const { collectionMethod } = selectedService;
    
    // Với logic mới dựa vào collectionMethod, luôn chỉ có 1 option
    // vì mỗi service chỉ có 1 collectionMethod cố định
    if (collectionMethod === 0 || collectionMethod === 1) {
      return 1;
    }
    
    // Fallback: nếu collectionMethod không rõ, hiển thị cả hai option
    return 2;
  };

  // Kiểm tra xem có nên hiển thị service type không dựa vào collectionMethod
  const shouldShowServiceType = (serviceType: string): boolean => {
    if (!selectedService) {
      // Nếu không có selectedService, hiển thị cả hai option (fallback cho compatibility)
      return ['home', 'clinic'].includes(serviceType);
    }
    
    const { collectionMethod } = selectedService;
    
    console.log('🔍 Checking service type visibility:', {
      serviceType,
      collectionMethod,
      selectedService: selectedService.title
    });
    
    // Dựa vào collectionMethod để quyết định hiển thị
    if (collectionMethod === 0) {
      // collectionMethod 0 = Tự thu mẫu / Thu tại nhà
      return serviceType === 'home';
    } else if (collectionMethod === 1) {
      // collectionMethod 1 = Thu mẫu tại trung tâm  
      return serviceType === 'clinic';
    }
    
    // Fallback: nếu collectionMethod không rõ, hiển thị cả hai option
    return ['home', 'clinic'].includes(serviceType);
  };

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setApiError(null);
    
    console.log('🚀 SUBMIT STARTED - Form validation');
    console.log('Current form data:', formData);
    console.log('Selected service:', enhancedSelectedService || selectedService);
    
    // Validate testServiceId before making API call
    if (!validateTestServiceId()) {
      setApiError("Có lỗi với dịch vụ được chọn. Vui lòng thử chọn lại dịch vụ từ trang trước.");
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔄 Mapping form data to API request...');
      
      // Map form data to API request format (now async)
      const bookingRequest = await mapFormDataToBookingRequest(
        formData, 
        enhancedSelectedService || selectedService, // Use enhanced version if available
        undefined // Don't pass temp clientId, let API handle it
      );
      
      console.log('✅ Request mapping successful, calling API...');
      
      // Call the API
      const result = await createBookingApi(bookingRequest);
      
      console.log('✅ API call successful:', result);
      
      // Store the response for success step
      setBookingResponse(result);
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Move to success step
      setStep(3);
    } catch (error) {
      console.error('❌ Booking creation failed:', error);
      
      // Handle validation errors (thrown by mapFormDataToBookingRequest)
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('Missing required')) {
          setApiError("Vui lòng điền đầy đủ thông tin bắt buộc.");
        } else if (errorMessage.includes('Invalid priceServiceId')) {
          setApiError("ID dịch vụ không hợp lệ. Vui lòng thử chọn lại dịch vụ.");
        } else if (errorMessage.includes('Invalid phone')) {
          setApiError("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại từ 10-15 chữ số.");
        } else if (errorMessage.includes('Name must be at least')) {
          setApiError("Tên phải có ít nhất 2 ký tự.");
        } else if (errorMessage.includes('Appointment date must be in the future')) {
          setApiError("Ngày hẹn phải là ngày trong tương lai.");
        } else if (errorMessage.includes('Invalid service ID format')) {
          setApiError("ID dịch vụ không hợp lệ. Vui lòng thử chọn lại dịch vụ.");
        } else if (errorMessage.includes('Invalid date/time format')) {
          setApiError("Định dạng ngày/giờ không hợp lệ. Vui lòng chọn lại ngày và giờ.");
        } else if (errorMessage.includes('Unable to determine TestService ID')) {
          setApiError("Không thể xác định dịch vụ. Vui lòng thử chọn lại dịch vụ từ trang trước.");
        } else if (errorMessage.includes('Unable to get user ID')) {
          setApiError("Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại.");
        } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
          setApiError("Bạn cần đăng nhập để đặt lịch. Vui lòng đăng nhập và thử lại.");
        } else if (errorMessage.includes('TestService not found')) {
          setApiError("Dịch vụ bạn chọn không tồn tại hoặc không khả dụng. Vui lòng chọn lại dịch vụ.");
        } else if (errorMessage.includes('An error occurred while saving the entity changes')) {
          setApiError("Có lỗi khi lưu thông tin đặt lịch. Có thể do ràng buộc dữ liệu. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.");
        } else if (errorMessage.includes('400')) {
          // Extract more details from 400 errors
          let errorDetail = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đã nhập.";
          
          // Try to extract specific error from message
          if (errorMessage.includes('foreign key')) {
            errorDetail = "Lỗi liên kết dữ liệu. Có thể cần đăng nhập hoặc chọn lại dịch vụ.";
          } else if (errorMessage.includes('constraint')) {
            errorDetail = "Vi phạm ràng buộc dữ liệu. Vui lòng kiểm tra lại thông tin.";
          } else if (errorMessage.includes('null')) {
            errorDetail = "Thiếu thông tin bắt buộc. Vui lòng điền đầy đủ form.";
          }
          
          setApiError(errorDetail);
          console.error('400 Bad Request error:', errorMessage);
          console.error('Form data:', formData);
        } else {
          setApiError(`Lỗi: ${errorMessage}`);
        }
      } else {
        setApiError("Đã xảy ra lỗi không xác định khi tạo đặt lịch. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    return formData.serviceType && formData.testType && selectedService;
  };

  const validateStep2 = () => {
    return (
      formData.name &&
      formData.phone &&
      formData.preferredDate &&
      formData.preferredTime &&
      (formData.serviceType === "clinic" || formData.address)
    );
  };

  const resetForm = () => {
    setFormData({
      serviceType: "home",
      name: "",
      phone: "",
      address: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
      testType: "civil-self",
    });
    setStep(1);
    setApiError(null);
    setBookingResponse(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <Card className="bg-white border-0 shadow-2xl">
          {/* Header */}
          <CardHeader className="p-6 text-white rounded-t-lg bg-gradient-to-r from-blue-900 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Đặt Lịch Xét Nghiệm ADN</h2>
                <p className="text-white/90">
                  Chọn gói xét nghiệm ADN và phương thức thu mẫu phù hợp
                </p>
              </div>
              <button
                type="button"
                title="Đóng"
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 transition-colors duration-200 rounded-full bg-white/20 hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNum
                        ? "bg-white text-blue-900"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {step > stepNum ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step > stepNum ? "bg-white" : "bg-white/20"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-blue-900">
                    Chọn hình thức thu mẫu
                  </h3>
                  <div className={`grid gap-4 ${
                    getAvailableServiceTypesCount() === 1 
                      ? "grid-cols-1 place-items-center" 
                      : "grid-cols-1 md:grid-cols-2"
                  }`}>
                    {/* Service Type Options */}
                    {shouldShowServiceType('home') && (
                      <label className={`cursor-pointer ${
                        getAvailableServiceTypesCount() === 1 ? "max-w-md" : ""
                      }`}>
                        <input
                          type="radio"
                          name="serviceType"
                          value="home"
                          checked={formData.serviceType === "home"}
                          onChange={(e) =>
                            handleInputChange("serviceType", e.target.value)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`p-6 border-2 rounded-lg transition-all duration-200 text-center ${
                            formData.serviceType === "home"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <HomeIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                          <h4 className="mb-2 font-semibold text-slate-700">
                            Tự thu mẫu / Thu tại nhà
                          </h4>
                          <p className="text-sm text-slate-600">
                            Nhận bộ kit ADN hoặc nhân viên đến tận nhà thu mẫu
                          </p>
                          <div className="mt-3 text-sm font-medium text-blue-600">
                            🧬 {selectedService?.category === 'civil' ? 'Phù hợp cho ADN Dân sự' : 'Phù hợp cho ADN Hành chính'}
                          </div>
                        </div>
                      </label>
                    )}

                    {/* Clinic Service */}
                    {shouldShowServiceType('clinic') && (
                      <label className={`cursor-pointer ${
                        getAvailableServiceTypesCount() === 1 ? "max-w-md" : ""
                      }`}>
                        <input
                          type="radio"
                          name="serviceType"
                          value="clinic"
                          checked={formData.serviceType === "clinic"}
                          onChange={(e) =>
                            handleInputChange("serviceType", e.target.value)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`p-6 border-2 rounded-lg transition-all duration-200 text-center ${
                            formData.serviceType === "clinic"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <BuildingIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                          <h4 className="mb-2 font-semibold text-slate-700">
                            Thu mẫu tại trung tâm
                          </h4>
                          <p className="text-sm text-slate-600">
                            Đến trung tâm để thu mẫu với quy trình chuẩn
                          </p>
                          <div className="mt-3 text-sm font-medium text-green-600">
                            ⚖️ Có giá trị pháp lý
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-blue-900">
                    Chọn gói xét nghiệm ADN
                  </h3>
                  
                  {getAvailableTestTypes().length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {getAvailableTestTypes().map((test) => (
                        <label key={test.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="testType"
                            value={test.id}
                            checked={formData.testType === test.id}
                            onChange={(e) =>
                              handleInputChange("testType", e.target.value)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                              formData.testType === test.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-slate-700">
                                  {test.name}
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    test.category === 'Dân sự' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {test.category}
                                  </span>
                                  <span>⏱️ {test.time}</span>
                                </div>
                              </div>
                              <span className="font-semibold text-blue-900">
                                {test.price}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-gray-500">
                        Vui lòng chọn hình thức thu mẫu để xem các gói xét nghiệm có sẵn
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                    className="px-8 py-3 !text-white bg-blue-900 hover:bg-blue-800"
                  >
                    Tiếp Theo
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Information Form */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-blue-900">
                  Thông tin liên hệ và đặt lịch
                </h3>

                {/* Authentication Warning */}
                {!isAuthenticated() && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircleIcon className="w-5 h-5 mr-2 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Bạn chưa đăng nhập. Để đặt lịch thành công, vui lòng đăng nhập trước khi tiếp tục.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Họ và Tên *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Nhập họ và tên"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Số điện thoại *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Nhập số điện thoại"
                      className="w-full"
                    />
                  </div>



                  {formData.serviceType === "home" && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Địa chỉ nhận kit / Thu mẫu *
                      </label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Nhập địa chỉ nhận bộ kit ADN hoặc địa chỉ thu mẫu tại nhà"
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Ngày mong muốn *
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        handleInputChange("preferredDate", e.target.value)
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Thời gian mong muốn *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) =>
                        handleInputChange("preferredTime", e.target.value)
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Chọn thời gian</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <AlertCircleIcon className="w-4 h-4 mr-2" />
                      Lưu ý thêm
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Ví dụ: Cần xét nghiệm cha con, mẹ con... hoặc yêu cầu đặc biệt khác"
                      className="w-full h-24 p-3 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Error Display */}
                {apiError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircleIcon className="w-5 h-5 mr-2 text-red-600" />
                      <p className="text-sm text-red-800">{apiError}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="px-6 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Quay Lại
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep2() || loading}
                    className="px-8 py-3 !text-white bg-blue-900 hover:bg-blue-800"
                  >
                    {loading ? (
                      <div className="flex items-center !text-white">
                        <div className="w-5 h-5 mr-2 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Xác Nhận Đặt Lịch"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="py-8 text-center">
                <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="mb-2 text-2xl font-bold text-green-600">
                  Đăng ký thành công!
                </h3>
                <p className="mb-6 text-slate-600">
                  {bookingResponse?.message || 
                   "Chúng tôi đã nhận được yêu cầu xét nghiệm ADN của bạn. Nhân viên tư vấn sẽ liên hệ với bạn trong vòng 30 phút để xác nhận và hướng dẫn chi tiết."}
                </p>
                <div className="p-4 mb-6 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <strong>Mã đăng ký:</strong> {bookingResponse?.id || `ADN${Date.now().toString().slice(-6)}`}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Thời gian:</strong> {formData.preferredDate} lúc{" "}
                    {formData.preferredTime}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Khách hàng:</strong> {formData.name}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Số điện thoại:</strong> {formData.phone}
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="px-8 py-3 !text-white bg-blue-900 hover:bg-blue-800"
                >
                  Đóng
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
