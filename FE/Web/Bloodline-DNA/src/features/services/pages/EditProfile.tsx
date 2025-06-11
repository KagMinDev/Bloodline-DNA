import React, { useState } from "react";
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  SaveIcon,
  ArrowLeftIcon,
  EditIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Header } from "../../../components";
import { Footer } from "../../../components";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const EditProfile = (): React.JSX.Element => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com", 
    phone: "0123456789",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[240px] overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003875]">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-profile" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-profile)" />
            </svg>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Breadcrumb>
                  <BreadcrumbList className="text-white/90">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="text-white/80 hover:text-white transition-colors duration-200">
                        Trang Chủ
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/60" />
                    <BreadcrumbItem>
                      <span className="text-[#00D4FF] font-semibold">Chỉnh Sửa Hồ Sơ</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Chỉnh Sửa Hồ Sơ
                <span className="block text-[#00D4FF] text-xl md:text-2xl font-medium mt-1">
                  Cập nhật thông tin cá nhân
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* Profile Edit Form */}
        <section className="py-16 md:py-20 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Thông Tin Cá Nhân</h2>
                      <p className="text-white/90">Quản lý và cập nhật thông tin của bạn</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      variant="outline"
                    >
                      <EditIcon className="w-4 h-4 mr-2" />
                      Chỉnh Sửa
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 gap-8">
                  {/* Profile Avatar */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900">{profile.name}</h3>
                    <p className="text-slate-600">Thành viên từ tháng 1/2024</p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Họ và Tên
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={profile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border-2 border-transparent">
                          <span className="text-slate-700">{profile.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <MailIcon className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3"
                          placeholder="Nhập địa chỉ email"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border-2 border-transparent">
                          <span className="text-slate-700">{profile.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Số Điện Thoại
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border-2 border-transparent">
                          <span className="text-slate-700">{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Address Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-900 flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Địa Chỉ
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={profile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3"
                          placeholder="Nhập địa chỉ"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border-2 border-transparent">
                          <span className="text-slate-700">{profile.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold flex-1 sm:flex-none"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        ) : (
                          <SaveIcon className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold flex-1 sm:flex-none"
                      >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Hủy Bỏ
                      </Button>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Lưu ý:</strong> Thông tin cá nhân của bạn được bảo mật và chỉ được sử dụng cho mục đích cung cấp dịch vụ y tế.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
}; 