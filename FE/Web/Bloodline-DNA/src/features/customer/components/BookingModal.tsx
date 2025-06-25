import {
  AlertCircleIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (bookingData: BookingData) => void;
}

interface BookingData {
  serviceType: "home" | "clinic";
  name: string;
  email: string;
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
}) => {
  const [formData, setFormData] = useState<BookingData>({
    serviceType: "home",
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    testType: "civil-self",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  interface TestType {
    id: string;
    name: string;
    price: string;
    time: string;
    category: string;
  }

  // Gói xét nghiệm theo hình thức thu mẫu
  const testTypesByServiceType: Record<string, TestType[]> = {
    home: [
      { id: "civil-self", name: "ADN Dân Sự - Tự Thu Mẫu (Kit)", price: "1.500.000đ", time: "5-7 ngày", category: "Dân sự" },
      { id: "civil-center", name: "ADN Dân Sự - Thu Tại Trung Tâm", price: "2.000.000đ", time: "3-5 ngày", category: "Dân sự" },
      { id: "civil-home", name: "ADN Dân Sự - Thu Tại Nhà", price: "2.500.000đ", time: "3-5 ngày", category: "Dân sự" },
    ],
    clinic: [
      { id: "legal-center", name: "ADN Hành Chính - Thu Tại Trung Tâm", price: "3.500.000đ", time: "7-10 ngày", category: "Hành chính" },
      { id: "legal-bone", name: "ADN Hành Chính - Giám Định Hài Cốt", price: "Liên hệ", time: "30+ ngày", category: "Hành chính" },
    ]
  };

  // Lấy gói xét nghiệm theo hình thức đã chọn
  const getAvailableTestTypes = (): TestType[] => {
    return testTypesByServiceType[formData.serviceType] || [];
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
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Reset testType nếu đổi serviceType và testType hiện tại không có trong danh sách mới
      if (field === 'serviceType') {
        const availableTypes = testTypesByServiceType[value] || [];
        const currentTestTypeExists = availableTypes.some(type => type.id === prev.testType);
        if (!currentTestTypeExists && availableTypes.length > 0) {
          newData.testType = availableTypes[0].id;
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);

    if (onSubmit) {
      onSubmit(formData);
    }

    setStep(3); // Success step
  };

  const validateStep1 = () => {
    return formData.serviceType && formData.testType && getAvailableTestTypes().length > 0;
  };

  const validateStep2 = () => {
    return (
      formData.name &&
      formData.phone &&
      formData.email &&
      formData.preferredDate &&
      formData.preferredTime &&
      (formData.serviceType === "clinic" || formData.address)
    );
  };

  const resetForm = () => {
    setFormData({
      serviceType: "home",
      name: "",
      email: "",
      phone: "",
      address: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
      testType: "civil-self",
    });
    setStep(1);
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Home Service */}
                    <label className="cursor-pointer">
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
                          🧬 Phù hợp cho ADN Dân sự
                        </div>
                      </div>
                    </label>

                    {/* Clinic Service */}
                    <label className="cursor-pointer">
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
                    className="px-8 py-3 text-white bg-blue-900 hover:bg-blue-800"
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

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <MailIcon className="w-4 h-4 mr-2" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Nhập địa chỉ email"
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
                    className="px-8 py-3 text-white bg-blue-900 hover:bg-blue-800"
                  >
                    {loading ? (
                      <div className="flex items-center">
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
                  Chúng tôi đã nhận được yêu cầu xét nghiệm ADN của bạn. Nhân viên tư vấn sẽ
                  liên hệ với bạn trong vòng 30 phút để xác nhận và hướng dẫn chi tiết.
                </p>
                <div className="p-4 mb-6 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <strong>Mã đăng ký:</strong> ADN
                    {Date.now().toString().slice(-6)}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Thời gian:</strong> {formData.preferredDate} lúc{" "}
                    {formData.preferredTime}
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="px-8 py-3 text-white bg-blue-900 hover:bg-blue-800"
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
