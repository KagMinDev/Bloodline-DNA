export interface PriceServiceRequest {
  price: number;
  collectionMethod: number;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
}

export interface TestRequest {
  name: string;
  description: string;
  type: number;
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