export interface TestBookingRequest {
  testServiceId: string;
  clientId: string;
  appointmentDate: string;
  note: string;
  clientName: string;
  address: string;
  phone: string;
  priceServiceId: string;
}

export interface TestBookingResponse {
  id: string;
  testServiceId: string;
  clientId: string;
  email: string;
  appointmentDate: string;
  price: number;
  collectionMethod: string;
  status: string; // Sử dụng const enum
  note: string;
  createdAt: string;
  updatedAt: string;
}