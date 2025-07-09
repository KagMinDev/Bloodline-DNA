export interface PriceServiceResponse {
  id: string;
  serviceId: string;
  price: number;
  collectionMethod: number;
  collectionMethodLabel?: string; // thêm nếu bạn muốn lưu label tiếng Việt tại đây
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testServiceInfor: TestServiceInfor;
}

export interface TestServiceInfor {
  id: string;
  name: string;
  description: string;  
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  priceServices: PriceServiceResponse[];
  sampleCount: number;
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
  sampleCount: number;
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "Civil":
      return "Dân sự";
    case "Legal":
      return "Pháp lý";
    default:
      return category;
  }
}

export function getCollectionMethodLabel(method: number): string {
  switch (method) {
    case 0:
      return "Tự lấy mẫu";
    case 1:
      return "Lấy mẫu tại cơ sở";
    default:
      return "Không xác định";
  }
}
