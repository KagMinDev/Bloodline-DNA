// src/features/customer/api/sampleApi.ts
import rootApi from "../../../apis/rootApi";

export interface SampleInfoPayload {
  sampleCode: string;
  donorName: string;
  relationshipToSubject: number;
  sampleType: number;
  collectedAt: string; // ISO string date
}

export interface SampleInfoResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Submits the sample information provided by the customer.
 * @param bookingId - The ID of the booking associated with the sample.
 * @param payload - The sample information.
 * @returns A promise that resolves to a success or error message.
 */
export const submitSampleInfoApi = async (bookingId: string, payload: SampleInfoPayload): Promise<SampleInfoResponse> => {
    try {
        // The endpoint is assumed to be /bookings/{bookingId}/samples
        // This might need adjustment based on the actual backend API.
        const response = await rootApi.post(`/bookings/${bookingId}/samples`, payload);
        
        if (response.status >= 200 && response.status < 300) {
            return {
                success: true,
                message: "Gửi thông tin mẫu thành công!",
                data: response.data
            };
        }
        throw new Error(response.data?.message || "Lỗi không xác định từ máy chủ.");

    } catch (error: any) {
        console.error("API Error: submitSampleInfoApi failed", error);
        const errorMessage = error.response?.data?.message || error.message || "Không thể gửi thông tin mẫu.";
        return {
            success: false,
            message: errorMessage
        };
    }
}; 