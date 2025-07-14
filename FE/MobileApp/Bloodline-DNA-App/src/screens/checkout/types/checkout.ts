export interface CheckoutRequest {
  bookingId: string;
}

export interface CheckoutResponse {
  checkoutUrl?: string;
  orderCode?: string;
  qrCode?: string;
  amount?: number;
  bookingId?: string;
  [key: string]: any;
}

export interface CallbackRequest {
  orderCode?: string;
  status?: string;
  bookingId?: string;
}

export interface CallbackResponse {
  orderCode: string;
  bookingId: string;
  status: 'PAID' | 'CANCELLED';
}

export interface ProgressStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  estimatedDate?: string;
  details?: string[];
  actionRequired?: boolean;
  actionText?: string;
  actionPayload?: {
    type: 'deposit' | 'remaining' | 'fill_sample_info' | 'confirm_delivery';
    bookingId?: string;
    amount?: number;
  };
}

export interface TestProgressData {
  bookingId: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  customerName: string;
  currentStep: number;
  steps: ProgressStep[];
  trackingNumber?: string;
  expectedResultDate?: string;
}