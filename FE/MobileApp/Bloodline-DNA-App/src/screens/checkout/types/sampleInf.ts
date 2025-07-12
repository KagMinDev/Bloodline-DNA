export interface SampleInfoPayload {
  kitId: string;
  donorName: string;
  relationshipToSubject: number;
  sampleType: number;
}

export interface SampleInfoResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface TestKitInfo {
  id: string;
  bookingId: string;
  shippedAt?: string;
  receivedAt?: string;
  sentToLabAt?: string;
  labReceivedAt?: string;
  note?: string;
  samples?: string[];
  sampleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestKitResponse {
  success: boolean;
  message: string;
  data?: TestKitInfo;
}

export interface TestSampleInfo {
  id: string;
  kitId: string;
  donorName: string;
  relationshipToSubject: number;
  sampleType: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestSampleResponse {
  success: boolean;
  message: string;
  data?: TestSampleInfo;
}

export interface UpdateBookingRequest {
  id: string;
  appointmentDate: string;
  status: number; 
  note: string;
  clientName: string;
  address: string;
  phone: string;
}

export interface UpdateBookingResponse {
  success: boolean;
  data?: any;
  message: string;
  statusCode?: number;
}