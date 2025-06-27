export interface TestKitRequest{
    bookingId: string;
    shippedAt: string;
    receivedAt: string;
    sentToLabAt: string;
    labReceivedAt: string;
    note: string;
    sampleCount: number;
}

export interface TestKitResponse{
    id: string;
    bookingId: string;
    shippedAt: string;
    receivedAt: string;
    sentToLabAt: string;
    labReceivedAt: string;
    note: string;
    samples: string[];
    createdAt: string;
    updatedAt: string;
    sampleCount: number;
}