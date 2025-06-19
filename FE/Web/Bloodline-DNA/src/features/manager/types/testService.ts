export interface PriceServiceRequest {
  id?: string;
  price: number;
  collectionMethod: number;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  currency?: string;
}

// Dùng cho tạo mới (POST)
export interface TestRequest {
  name: string;
  description: string;
  type: number; // BẮT BUỘC là number khi tạo mới
  isActive: boolean;
  priceServices: PriceServiceRequest[];
}

// Dùng cho cập nhật (PUT)
export interface TestUpdateRequest {
  id: string;
  name: string;
  description: string;
  category: string; // BẮT BUỘC là string khi cập nhật
  isActive: boolean;
  priceServices: PriceServiceRequest[];
}

export interface PriceServiceResponse {
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
  testServiceInfor: string;
}

export interface TestResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  priceServices: PriceServiceResponse[];
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "civil":
      return "Dân sự";
    case "legal":
      return "Pháp lý";
    default:
      return category;
  }
}