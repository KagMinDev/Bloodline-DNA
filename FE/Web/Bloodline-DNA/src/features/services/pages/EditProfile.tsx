import {
  ArrowLeftIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SaveIcon,
  UserIcon
} from "lucide-react";
import React, { useState } from "react";
import { Footer, Header } from "../../../components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

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
      <div className="relative w-full max-w-none">
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
          <div className="relative z-10 flex items-center h-full">
            <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Breadcrumb>
                  <BreadcrumbList className="text-white/90">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="transition-colors duration-200 text-white/80 hover:text-white">
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
              <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
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
          <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="p-6 text-white rounded-t-lg bg-gradient-to-r from-blue-900 to-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-white/20">
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
                      className="text-white bg-white/20 hover:bg-white/30 border-white/30"
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
                      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                      {isEditing && (
                        <button type="button" title="Edit Icon" className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 text-white transition-colors duration-200 bg-blue-600 rounded-full hover:bg-blue-700">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900">{profile.name}</h3>
                    <p className="text-slate-600">Thành viên từ tháng 1/2024</p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Họ và Tên
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={profile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="p-3 border-2 border-transparent rounded-lg bg-gray-50">
                          <span className="text-slate-700">{profile.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MailIcon className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập địa chỉ email"
                        />
                      ) : (
                        <div className="p-3 border-2 border-transparent rounded-lg bg-gray-50">
                          <span className="text-slate-700">{profile.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Số Điện Thoại
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="p-3 border-2 border-transparent rounded-lg bg-gray-50">
                          <span className="text-slate-700">{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Address Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Địa Chỉ
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={profile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập địa chỉ"
                        />
                      ) : (
                        <div className="p-3 border-2 border-transparent rounded-lg bg-gray-50">
                          <span className="text-slate-700">{profile.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 sm:flex-row">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 px-8 py-3 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 sm:flex-none"
                      >
                        {loading ? (
                          <div className="w-5 h-5 mr-2 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        ) : (
                          <SaveIcon className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 px-8 py-3 font-semibold text-gray-700 border-gray-300 rounded-lg hover:bg-gray-50 sm:flex-none"
                      >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Hủy Bỏ
                      </Button>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="p-4 rounded-lg bg-blue-50">
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