export interface SampleTestRequest{
  sampleType: number;
  instructionText: string;
  mediaUrl: string;
}

export interface SampleTestResponse {
  success: boolean;
  data: {
    id: string;
    sampleType: number;
    instructionText: string;
    mediaUrl: string;
  };
  message: string;
  statusCode: number;
}