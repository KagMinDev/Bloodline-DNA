export interface TestKitRequest {
    bookingId: string;
    shippedAt: string;
    receivedAt: string;
    sentToLabAt: string;
    labReceivedAt: string;
    note: string;
    sampleCount: number;
}

export interface TestKitResponse {
  id: string;
  bookingId: string;
  shippedAt: string;
  receivedAt: string;
  sentToLabAt: string;
  labReceivedAt: string;
  note: string;
  samples: string[];
  sampleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestKitUpdateRequest extends TestKitRequest {
  id: string;
}
