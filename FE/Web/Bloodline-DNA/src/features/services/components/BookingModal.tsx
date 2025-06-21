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
    testType: "general",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const testTypes = [
    { id: "general", name: "Xét nghiệm tổng quát", price: "500.000đ" },
    { id: "covid", name: "Test COVID-19", price: "300.000đ" },
    { id: "blood", name: "Xét nghiệm máu", price: "400.000đ" },
    { id: "urine", name: "Xét nghiệm nước tiểu", price: "200.000đ" },
    { id: "genetic", name: "Xét nghiệm gen", price: "2.000.000đ" },
  ];

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
      testType: "general",
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
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white border-0 shadow-2xl">
          {/* Header */}
          <CardHeader className="p-6 text-white rounded-t-lg bg-gradient-to-r from-blue-900 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Đặt Lịch Xét Nghiệm</h2>
                <p className="text-white/90">
                  Chọn dịch vụ và thời gian phù hợp
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
                    Chọn loại xét nghiệm
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {testTypes.map((test) => (
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
                            <span className="font-medium text-slate-700">
                              {test.name}
                            </span>
                            <span className="font-semibold text-blue-900">
                              {test.price}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

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
                          Tự thu mẫu tại nhà
                        </h4>
                        <p className="text-sm text-slate-600">
                          Nhận bộ kit xét nghiệm tại nhà và tự thu mẫu
                        </p>
                        <div className="mt-3 text-sm font-medium text-blue-600">
                          + 50.000đ phí vận chuyển
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
                          Thu mẫu tại cơ sở
                        </h4>
                        <p className="text-sm text-slate-600">
                          Đến cơ sở y tế để thu mẫu xét nghiệm
                        </p>
                        <div className="mt-3 text-sm font-medium text-green-600">
                          Miễn phí
                        </div>
                      </div>
                    </label>
                  </div>
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
                  Thông tin đặt lịch
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
                        Địa chỉ nhận kit *
                      </label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Nhập địa chỉ nhận bộ kit xét nghiệm"
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
                      placeholder="Nhập lưu ý hoặc yêu cầu đặc biệt (nếu có)"
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
                  Đặt lịch thành công!
                </h3>
                <p className="mb-6 text-slate-600">
                  Chúng tôi đã nhận được yêu cầu đặt lịch của bạn. Nhân viên sẽ
                  liên hệ với bạn trong vòng 30 phút để xác nhận.
                </p>
                <div className="p-4 mb-6 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <strong>Mã đặt lịch:</strong> BL
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
