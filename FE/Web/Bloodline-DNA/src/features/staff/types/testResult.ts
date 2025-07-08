export interface TestResultRequest {
  id?: string;
  testBookingId: string;
  resultSummary: string;
  resultDate: Date;
  resultFileUrl: string;
}

export interface TestResultResponse {
  id: string;
  testBookingId: string;
  resultSummary: string;
  resultDate: Date;
  resultFileUrl: string;
  client: {
    id: string;
    fullName: string;
    address: string;
    email: string;
    role: string;
  }
  createdAt: Date;
  updatedAt: Date;
}