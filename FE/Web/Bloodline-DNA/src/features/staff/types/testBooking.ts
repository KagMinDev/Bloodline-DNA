export interface TestBookingResponse {
  id: string;
  testServiceId: string;
  clientId: string;
  email: string;
  bookingDate: string;
  price: number;
  collectionMethod: string;
  status: string; // Sử dụng const enum
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestBookingStatusRequest {
  bookingId: string;
  status: number; 
}