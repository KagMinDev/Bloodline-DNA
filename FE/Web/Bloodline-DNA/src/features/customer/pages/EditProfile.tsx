import {
  ArrowLeftIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SaveIcon,
  UserIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../../components";
import ChatbotAI from "../../chatbotAI/components/ChatbotAI";
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
import { getUserInfoApi, getMockUserData, updateUserInfoApi, type User, type UpdateUserData } from "../api/userApi";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role?: string;
}

export const EditProfile = (): React.JSX.Element => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "", 
    phone: "",
    address: "",
    role: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        
        const userData = await getUserInfoApi();
        
        // Validate essential data
        if (!userData || !userData.id) {
          throw new Error("Dữ liệu người dùng không hợp lệ");
        }
        
        // Transform API data to profile format with safe fallbacks
        const userProfile: UserProfile = {
          name: userData.fullName || 'Chưa cập nhật',
          email: userData.email || 'Chưa cập nhật',
          phone: userData.phone || 'Chưa cập nhật',
          address: userData.address || 'Chưa cập nhật',
          role: userData.role || 'Khách hàng'
        };
        
        setProfile(userProfile);
        setOriginalProfile(userProfile);
      } catch (err) {
        console.error("Error loading user data:", err);
        
        // Fallback to mock data
        const mockData = getMockUserData();
        const mockProfile: UserProfile = {
          name: mockData.fullName,
          email: mockData.email,
          phone: mockData.phone,
          address: mockData.address,
          role: mockData.role
        };
        
        setProfile(mockProfile);
        setOriginalProfile(mockProfile);
        
        // Set error message based on the error from API
        const errorMessage = err instanceof Error 
          ? err.message
          : 'Không thể tải thông tin người dùng';
        setError(`${errorMessage}. Đang hiển thị dữ liệu mẫu.`);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!profile.name || profile.name.trim() === '' || profile.name === 'Chưa cập nhật') {
        throw new Error('Vui lòng nhập họ và tên');
      }
      if (!profile.phone || profile.phone.trim() === '' || profile.phone === 'Chưa cập nhật') {
        throw new Error('Vui lòng nhập số điện thoại');
      }
      if (!profile.address || profile.address.trim() === '' || profile.address === 'Chưa cập nhật') {
        throw new Error('Vui lòng nhập địa chỉ');
      }

      // Prepare update data (exclude email as it's not updatable)
      const updateData: UpdateUserData = {
        fullName: profile.name.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim()
      };

      // Call update API
      const updatedUser = await updateUserInfoApi(updateData);
      
      // Update profile with response data
      const updatedProfile: UserProfile = {
        name: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      };
      
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);
      
      // Clear any previous errors and show success
      setError(null);
      setSuccessMessage('Cập nhật thông tin thành công!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      console.log('✅ Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      
      // Set error message for user
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi cập nhật thông tin';
      setError(`Lỗi cập nhật: ${errorMessage}`);
      
      // TODO: Add error toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (originalProfile) {
      setProfile(originalProfile);
    }
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-20 bg-blue-50 overflow-hidden">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-profile" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="#1e40af"/>
                  <rect x="4" y="8" width="12" height="4" fill="#1e40af"/>
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
                  <BreadcrumbList className="text-blue-600">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="transition-colors duration-200 text-blue-600 hover:text-blue-800">
                        Trang Chủ
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-blue-400" />
                    <BreadcrumbItem>
                      <span className="text-blue-900 font-semibold">Chỉnh Sửa Hồ Sơ</span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold leading-tight text-blue-900 md:text-4xl">
                Chỉnh Sửa Hồ Sơ
                <span className="block text-blue-700 text-xl md:text-2xl font-medium mt-1">
                  Cập nhật thông tin cá nhân
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* Success Message Display */}
        {successMessage && (
          <section className="py-4 bg-green-50 border-y-2 border-green-200">
            <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
              <div className="flex items-center p-4 rounded-lg bg-green-100 border border-green-200">
                <div className="mr-3 text-green-600">✅</div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Error/Warning Display */}
        {error && (
          <section className={`py-4 border-y-2 ${
            error.includes('đăng nhập') || error.includes('hết hạn') 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
              <div className={`flex items-center p-4 rounded-lg border ${
                error.includes('đăng nhập') || error.includes('hết hạn')
                  ? 'bg-orange-100 border-orange-200'
                  : 'bg-yellow-100 border-yellow-200'
              }`}>
                <div className={`mr-3 ${
                  error.includes('đăng nhập') || error.includes('hết hạn') 
                    ? 'text-orange-600' 
                    : 'text-yellow-600'
                }`}>
                  {error.includes('đăng nhập') || error.includes('hết hạn') ? '🔐' : '⚠️'}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    error.includes('đăng nhập') || error.includes('hết hạn') 
                      ? 'text-orange-800' 
                      : 'text-yellow-800'
                  }`}>{error}</p>
                  {error.includes('mẫu') && !error.includes('đăng nhập') && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Để xem dữ liệu thực từ API, vui lòng kiểm tra kết nối mạng hoặc liên hệ hỗ trợ.
                    </p>
                  )}
                                     {error.includes('đăng nhập') && (
                     <p className="text-sm text-orange-600 mt-1">
                       Vui lòng đăng nhập để xem thông tin cá nhân. Hiện tại đang hiển thị dữ liệu mẫu.
                     </p>
                   )}
                </div>
              </div>
            </div>
          </section>
        )}

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

              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Profile Avatar */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                      {isEditing && (
                        <button type="button" title="Edit Icon" className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 !text-white transition-colors duration-200 bg-blue-600 rounded-full hover:bg-blue-700">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {profile.name && profile.name !== 'Chưa cập nhật' ? profile.name : 'Chưa có tên'}
                    </h3>
                    <p className="text-slate-600">
                      {profile.role && profile.role !== 'Khách hàng' ? `Vai trò: ${profile.role}` : 'Vai trò: Khách hàng'}
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Name Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Họ và Tên
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={profile.name === 'Chưa cập nhật' ? '' : profile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={profile.name}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      )}
                    </div>

                    {/* Email Field - Always Read-only */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MailIcon className="w-4 h-4 mr-2" />
                        Email
                        <span className="ml-2 text-xs text-gray-500">(Không thể chỉnh sửa)</span>
                      </label>
                      <Input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Số Điện Thoại
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={profile.phone === 'Chưa cập nhật' ? '' : profile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <Input
                          type="tel"
                          value={profile.phone}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      )}
                    </div>

                    {/* Address Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Địa Chỉ
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={profile.address === 'Chưa cập nhật' ? '' : profile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          placeholder="Nhập địa chỉ"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={profile.address}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 sm:flex-row">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 px-8 py-3 font-semibold !text-white bg-blue-900 rounded-lg hover:bg-blue-800 sm:flex-none"
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
          <div className="fixed bottom-0 right-0 p-4">
            <ChatbotAI />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}; 