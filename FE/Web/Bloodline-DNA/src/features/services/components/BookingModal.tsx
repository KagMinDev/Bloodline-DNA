import React, { useState } from "react";
import { 
  X, 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  HomeIcon,
  BuildingIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (bookingData: BookingData) => void;
}

interface BookingData {
  serviceType: 'home' | 'clinic';
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  testType: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BookingData>({
    serviceType: 'home',
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    testType: 'general'
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const testTypes = [
    { id: 'general', name: 'Xét nghiệm tổng quát', price: '500.000đ' },
    { id: 'covid', name: 'Test COVID-19', price: '300.000đ' },
    { id: 'blood', name: 'Xét nghiệm máu', price: '400.000đ' },
    { id: 'urine', name: 'Xét nghiệm nước tiểu', price: '200.000đ' },
    { id: 'genetic', name: 'Xét nghiệm gen', price: '2.000.000đ' }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    if (onSubmit) {
      onSubmit(formData);
    }
    
    setStep(3); // Success step
  };

  const validateStep1 = () => {
    return formData.testType && formData.serviceType;
  };

  const validateStep2 = () => {
    return formData.name && formData.phone && formData.email && 
           formData.preferredDate && formData.preferredTime &&
           (formData.serviceType === 'clinic' || formData.address);
  };

  const resetForm = () => {
    setFormData({
      serviceType: 'home',
      name: '',
      email: '',
      phone: '',
      address: '',
      preferredDate: '',
      preferredTime: '',
      notes: '',
      testType: 'general'
    });
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl border-0">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Đặt Lịch Xét Nghiệm</h2>
                <p className="text-white/90">Chọn dịch vụ và thời gian phù hợp</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum ? 'bg-white text-blue-900' : 'bg-white/20 text-white'
                  }`}>
                    {step > stepNum ? <CheckCircleIcon className="w-5 h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-white' : 'bg-white/20'}`}></div>
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
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Chọn loại xét nghiệm</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {testTypes.map((test) => (
                      <label key={test.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="testType"
                          value={test.id}
                          checked={formData.testType === test.id}
                          onChange={(e) => handleInputChange('testType', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          formData.testType === test.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">{test.name}</span>
                            <span className="text-blue-900 font-semibold">{test.price}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Chọn hình thức thu mẫu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Home Service */}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="home"
                        checked={formData.serviceType === 'home'}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-6 border-2 rounded-lg transition-all duration-200 text-center ${
                        formData.serviceType === 'home' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}>
                        <HomeIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                        <h4 className="font-semibold text-slate-700 mb-2">Tự thu mẫu tại nhà</h4>
                        <p className="text-sm text-slate-600">Nhận bộ kit xét nghiệm tại nhà và tự thu mẫu</p>
                        <div className="mt-3 text-sm text-blue-600 font-medium">+ 50.000đ phí vận chuyển</div>
                      </div>
                    </label>

                    {/* Clinic Service */}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="clinic"
                        checked={formData.serviceType === 'clinic'}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-6 border-2 rounded-lg transition-all duration-200 text-center ${
                        formData.serviceType === 'clinic' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}>
                        <BuildingIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                        <h4 className="font-semibold text-slate-700 mb-2">Thu mẫu tại cơ sở</h4>
                        <p className="text-sm text-slate-600">Đến cơ sở y tế để thu mẫu xét nghiệm</p>
                        <div className="mt-3 text-sm text-green-600 font-medium">Miễn phí</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
                  >
                    Tiếp Theo
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Information Form */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-blue-900">Thông tin đặt lịch</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-900 flex items-center">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Họ và Tên *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-900 flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Số điện thoại *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-blue-900 flex items-center">
                      <MailIcon className="w-4 h-4 mr-2" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập địa chỉ email"
                      className="w-full"
                    />
                  </div>

                  {formData.serviceType === 'home' && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Địa chỉ nhận kit *
                      </label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ nhận bộ kit xét nghiệm"
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-900 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Ngày mong muốn *
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-900 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Thời gian mong muốn *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Chọn thời gian</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-blue-900 flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-2" />
                      Lưu ý thêm
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Nhập lưu ý hoặc yêu cầu đặc biệt (nếu có)"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3"
                  >
                    Quay Lại
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep2() || loading}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      'Xác Nhận Đặt Lịch'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">Đặt lịch thành công!</h3>
                <p className="text-slate-600 mb-6">
                  Chúng tôi đã nhận được yêu cầu đặt lịch của bạn. 
                  Nhân viên sẽ liên hệ với bạn trong vòng 30 phút để xác nhận.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Mã đặt lịch:</strong> BL{Date.now().toString().slice(-6)}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Thời gian:</strong> {formData.preferredDate} lúc {formData.preferredTime}
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
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