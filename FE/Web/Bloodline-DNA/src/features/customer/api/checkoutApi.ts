// src/features/customer/api/checkoutApi.ts
const BASE_URL = 'https://api.adntester.duckdns.org';

interface CallbackPayload {
    orderCode: string;
    status: string;
    bookingId: string;
    timestamp?: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

/**
 * Validate callback payload before sending to server
 */
const validateCallbackPayload = (payload: CallbackPayload): { isValid: boolean; error?: string } => {
    if (!payload.bookingId || typeof payload.bookingId !== 'string' || payload.bookingId.trim() === '') {
        return { isValid: false, error: 'bookingId is required and must be a non-empty string' };
    }
    if (!payload.orderCode || typeof payload.orderCode !== 'string' || payload.orderCode.trim() === '') {
        return { isValid: false, error: 'orderCode is required and must be a non-empty string' };
    }
    if (!payload.status || typeof payload.status !== 'string' || payload.status.trim() === '') {
        return { isValid: false, error: 'status is required and must be a non-empty string' };
    }
    return { isValid: true };
};

const callPaymentCallbackApi = async (payload: CallbackPayload): Promise<ApiResponse> => {
    const url = `${BASE_URL}/api/Payment/callback`;
    const token = localStorage.getItem('token') || '';
    
    // Validate payload before sending
    const validation = validateCallbackPayload(payload);
    if (!validation.isValid) {
        console.error('[Payment Callback] Validation failed:', validation.error);
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: validation.error || 'Invalid payload'
            }
        };
    }

    console.log('[Payment Callback] Request:', {
        url,
        payload,
        time: new Date().toISOString()
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': crypto.randomUUID()
            },
            body: JSON.stringify({
                ...payload,
                timestamp: new Date().toISOString() // Add timestamp for tracking
            }),
        });

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Payment Callback] Error Response:', {
                status: response.status,
                statusText: response.statusText,
                data: errorData
            });

            // Handle specific error cases
            if (response.status === 400) {
                return {
                    success: false,
                    error: {
                        code: 'BAD_REQUEST',
                        message: errorData.title || 'Validation error',
                        details: errorData.errors || {}
                    }
                };
            }

            if (response.status === 404) {
                return {
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Booking not found',
                        details: errorData
                    }
                };
            }

            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('[Payment Callback] Success:', responseData);
        return {
            success: true,
            data: responseData,
            message: responseData.message || 'Callback processed successfully'
        };

    } catch (error) {
        console.error('[Payment Callback] System Error:', error);
        return {
            success: false,
            error: {
                code: 'SYSTEM_ERROR',
                message: error instanceof Error ? error.message : 'Unknown system error'
            }
        };
    }
};

export const updateErrorStatusApi = async (
    orderCode: string, 
    status: string, 
    bookingId: string
): Promise<ApiResponse> => {
    if (!bookingId) {
        return {
            success: false,
            error: {
                code: 'MISSING_BOOKING_ID',
                message: 'bookingId is required'
            }
        };
    }

    const payload: CallbackPayload = {
        orderCode,
        status,
        bookingId // Use the actual bookingId passed as parameter
    };
    return callPaymentCallbackApi(payload);
};

export const updateSuccessStatusApi = async (
    orderCode: string, 
    bookingId: string
): Promise<ApiResponse> => {
    if (!bookingId) {
        return {
            success: false,
            error: {
                code: 'MISSING_BOOKING_ID',
                message: 'bookingId is required'
            }
        };
    }

    const payload: CallbackPayload = {
        orderCode,
        status: "PAID",
        bookingId // Use the actual bookingId passed as parameter
    };
    return callPaymentCallbackApi(payload);
};