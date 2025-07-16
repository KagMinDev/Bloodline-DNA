import React, { useState, useEffect } from 'react';
import { MapPinIcon } from 'lucide-react';
import axios from 'axios';

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

interface Province {
  code: string;
  name: string;
  districts: District[];
}

interface District {
  name: string;
  province: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  placeholder = "Nhập địa chỉ chi tiết",
  disabled = false,
  required = false,
  className = ""
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDetailedAddress, setCurrentDetailedAddress] = useState('');

  // Parse địa chỉ từ value để set selectedProvince và selectedDistrict
  useEffect(() => {
    if (value && provinces.length > 0 && districts.length > 0 && !isTyping) {
      const addressParts = value.split(',').map(part => part.trim());
      
      // Tìm tỉnh/thành phố (thường là phần cuối)
      const provincePart = addressParts[addressParts.length - 1];
      if (provincePart && provinces.some(p => p.name === provincePart)) {
        setSelectedProvince(provincePart);
        
        // Tìm quận/huyện (thường là phần thứ 2 từ cuối)
        if (addressParts.length >= 2) {
          const districtPart = addressParts[addressParts.length - 2];
          if (districtPart && districts.some(d => d.name === districtPart && d.province === provincePart)) {
            setSelectedDistrict(districtPart);
          }
        }
      }
    }
  }, [value, provinces, districts, isTyping]);

  // Clear error when data loads successfully
  useEffect(() => {
    if (provinces.length > 0 && error) {
      setError(null);
    }
  }, [provinces, error]);

  // Update currentDetailedAddress when value changes from outside
  useEffect(() => {
    if (!isTyping) {
      setCurrentDetailedAddress(getDetailedAddress());
    }
  }, [value, isTyping]);

  // Reset selections when value changes to empty
  useEffect(() => {
    if (!value) {
      setSelectedProvince('');
      setSelectedDistrict('');
    }
  }, [value]);

  // Handle special case for "TẠI CƠ SỞ" address
  const isClinicAddress = value === 'TẠI CƠ SỞ';

  useEffect(() => {
    const fetchAddressData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/?depth=2");
        setProvinces(response.data);
        
        // Tạo danh sách tất cả quận/huyện
        let allDistricts: District[] = [];
        response.data.forEach((province: Province) => {
          province.districts.forEach((district: any) => {
            allDistricts.push({
              name: district.name,
              province: province.name,
            });
          });
        });
        setDistricts(allDistricts);
      } catch (error) {
        console.error("Error fetching address data:", error);
        setError("Không thể tải danh sách địa chỉ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressData();
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    setSelectedDistrict('');
    
    // Cập nhật địa chỉ với tỉnh mới
    const currentAddress = getDetailedAddress();
    const newAddress = currentAddress ? `${currentAddress}, ${provinceName}` : provinceName;
    onChange(newAddress);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    
    // Cập nhật địa chỉ với quận/huyện mới
    const currentAddress = getDetailedAddress();
    const newAddress = currentAddress ? `${currentAddress}, ${districtName}, ${selectedProvince}` : `${districtName}, ${selectedProvince}`;
    onChange(newAddress);
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressValue = e.target.value;
    setCurrentDetailedAddress(addressValue);
    
    let fullAddress = addressValue;
    
    // Thêm quận/huyện và tỉnh nếu đã chọn
    if (selectedDistrict && selectedProvince) {
      fullAddress = `${addressValue}, ${selectedDistrict}, ${selectedProvince}`;
    } else if (selectedProvince) {
      fullAddress = `${addressValue}, ${selectedProvince}`;
    }
    
    onChange(fullAddress);
  };

  const handleAddressInputFocus = () => {
    setIsTyping(true);
  };

  const handleAddressInputBlur = () => {
    setIsTyping(false);
  };

  // Lấy phần địa chỉ chi tiết (không bao gồm quận/huyện, tỉnh)
  const getDetailedAddress = () => {
    if (!value) return '';
    
    // Nếu địa chỉ chứa quận/huyện và tỉnh (ít nhất 2 dấu phẩy)
    const commaCount = (value.match(/,/g) || []).length;
    
    if (commaCount >= 2) {
      // Tìm vị trí của dấu phẩy thứ 2 từ cuối
      const parts = value.split(',');
      const detailedParts = parts.slice(0, -2);
      return detailedParts.join(',').trim();
    } else if (commaCount === 1) {
      // Chỉ có 1 dấu phẩy (địa chỉ, tỉnh)
      return value.split(',')[0].trim();
    } else {
      // Không có dấu phẩy, trả về toàn bộ
      return value.trim();
    }
  };

  // Kiểm tra xem địa chỉ có hợp lệ không
  const isValidAddress = () => {
    if (!value) return false;
    const commaCount = (value.match(/,/g) || []).length;
    return commaCount >= 1 && selectedProvince;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Special case for clinic address */}
      {isClinicAddress ? (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Địa chỉ:</strong> {value}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Xét nghiệm sẽ được thực hiện tại trung tâm
          </p>
        </div>
      ) : (
        <>
          {/* Tỉnh/Thành phố */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              disabled={disabled || isLoading}
              required={required}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {isLoading ? "Đang tải..." : "Chọn tỉnh/thành phố"}
              </option>
              {provinces.length > 0 ? (
                provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có dữ liệu
                </option>
              )}
            </select>
          </div>

          {/* Quận/Huyện */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={disabled || isLoading || !selectedProvince}
              required={required}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!selectedProvince ? "Vui lòng chọn tỉnh/thành phố trước" : "Chọn quận/huyện"}
              </option>
              {districts
                .filter((district) => district.province === selectedProvince)
                .map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name}
                  </option>
                ))}
              {districts.filter((district) => district.province === selectedProvince).length === 0 && selectedProvince && (
                <option value="" disabled>
                  Không có quận/huyện cho tỉnh này
                </option>
              )}
            </select>
          </div>

          {/* Địa chỉ chi tiết */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={isTyping ? currentDetailedAddress : getDetailedAddress()}
                onChange={handleAddressInputChange}
                onFocus={handleAddressInputFocus}
                onBlur={handleAddressInputBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Số 123, Đường ABC, Phường XYZ
            </p>
          </div>
        </>
      )}
    </div>
  );
}; 