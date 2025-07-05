// src/features/customer/api/checkoutApi.ts
const BASE_URL = 'https://api.adntester.duckdns.org';

interface CallbackPayload {
    orderCode: string;
    status: string;
    bookingId: string;
}

const callPaymentCallbackApi = async (payload: CallbackPayload): Promise<any> => {
    const url = `${BASE_URL}/api/Payment/callback`;
    console.log('Calling payment callback API:', url);
    console.log('Payload:', payload);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to call callback API, server responded with:", errorText);
            throw new Error(`Error calling payment callback API: ${response.statusText}`);
        }
        
        const responseText = await response.text();
        if (responseText) {
            try {
                const responseData = JSON.parse(responseText);
                console.log("Callback API response:", responseData);
                return responseData;
            } catch (e) {
                console.warn("Could not parse JSON from response:", responseText);
                return { success: true, data: responseText };
            }
        }

        console.log("Callback API call successful with no content in response.");
        return { success: true };
    } catch (error) {
        console.error("Error in callPaymentCallbackApi:", error);
        throw error;
    }
};

export const updateErrorStatusApi = async (orderCode: string, status: string): Promise<any> => {
    const payload: CallbackPayload = {
        orderCode: orderCode,
        status: status,
        bookingId: orderCode, // Assuming orderCode is the bookingId
    };
    return callPaymentCallbackApi(payload);
};

export const updateSuccessStatusApi = async (orderCode: string): Promise<any> => {
    const payload: CallbackPayload = {
        orderCode: orderCode,
        status: "PAID", // Assuming a fixed status for success cases
        bookingId: orderCode, // Assuming orderCode is the bookingId
    };
    return callPaymentCallbackApi(payload);
}; 