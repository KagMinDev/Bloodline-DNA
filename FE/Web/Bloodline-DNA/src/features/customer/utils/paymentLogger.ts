/**
 * Payment Logger Utility
 * Tập trung tất cả logging liên quan đến thanh toán
 */

export interface PaymentLogData {
  bookingId?: string;
  orderCode?: string;
  paymentUrl?: string;
  checkoutUrl?: string;
  status?: string;
  amount?: number;
  paymentType?: 'deposit' | 'remaining';
  timestamp?: string;
  [key: string]: any;
}

export class PaymentLogger {
  private static instance: PaymentLogger;
  private logs: Array<{ type: string; data: PaymentLogData; timestamp: string }> = [];

  private constructor() {}

  public static getInstance(): PaymentLogger {
    if (!PaymentLogger.instance) {
      PaymentLogger.instance = new PaymentLogger();
    }
    return PaymentLogger.instance;
  }

  // Log khi bắt đầu quá trình thanh toán
  public logPaymentStart(data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_START',
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('🚀 PAYMENT_START:', logEntry);
  }

  // Log khi gọi API thanh toán
  public logPaymentApiCall(endpoint: string, data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_API_CALL',
      data: {
        endpoint,
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('📞 PAYMENT_API_CALL:', logEntry);
  }

  // Log khi nhận response từ API thanh toán
  public logPaymentApiResponse(data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_API_RESPONSE',
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('📦 PAYMENT_API_RESPONSE:', logEntry);
  }

  // Log khi redirect đến trang thanh toán
  public logPaymentRedirect(url: string, data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_REDIRECT',
      data: {
        redirectUrl: url,
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('🔗 PAYMENT_REDIRECT:', logEntry);
  }

  // Log khi user quay lại từ trang thanh toán
  public logPaymentReturn(data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_RETURN',
      data: {
        returnUrl: window.location.href,
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('🔙 PAYMENT_RETURN:', logEntry);
  }

  // Log khi xử lý callback thanh toán
  public logPaymentCallback(data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_CALLBACK',
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('🔄 PAYMENT_CALLBACK:', logEntry);
  }

  // Log khi thanh toán thành công
  public logPaymentSuccess(data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_SUCCESS',
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('✅ PAYMENT_SUCCESS:', logEntry);
  }

  // Log khi thanh toán thất bại
  public logPaymentError(error: string, data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_ERROR',
      data: {
        error,
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.error('❌ PAYMENT_ERROR:', logEntry);
  }

  // Log khi thanh toán bị hủy
  public logPaymentCancel(data: PaymentLogData): void {
    const logEntry = {
      type: 'PAYMENT_CANCEL',
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    console.log('❌ PAYMENT_CANCEL:', logEntry);
  }

  // Lấy tất cả logs
  public getAllLogs(): Array<{ type: string; data: PaymentLogData; timestamp: string }> {
    return [...this.logs];
  }

  // Lấy logs theo type
  public getLogsByType(type: string): Array<{ type: string; data: PaymentLogData; timestamp: string }> {
    return this.logs.filter(log => log.type === type);
  }

  // Lấy logs theo bookingId
  public getLogsByBookingId(bookingId: string): Array<{ type: string; data: PaymentLogData; timestamp: string }> {
    return this.logs.filter(log => log.data.bookingId === bookingId);
  }

  // Export logs as JSON
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear all logs
  public clearLogs(): void {
    this.logs = [];
    console.log('🗑️ Payment logs cleared');
  }

  // Log summary cho một booking
  public logPaymentSummary(bookingId: string): void {
    const bookingLogs = this.getLogsByBookingId(bookingId);
    const summary = {
      bookingId,
      totalLogs: bookingLogs.length,
      logTypes: [...new Set(bookingLogs.map(log => log.type))],
      firstLog: bookingLogs[0]?.timestamp,
      lastLog: bookingLogs[bookingLogs.length - 1]?.timestamp,
      paymentUrls: bookingLogs
        .filter(log => log.data.paymentUrl || log.data.checkoutUrl || log.data.redirectUrl)
        .map(log => ({
          type: log.type,
          url: log.data.paymentUrl || log.data.checkoutUrl || log.data.redirectUrl,
          timestamp: log.timestamp
        })),
      errors: bookingLogs.filter(log => log.type === 'PAYMENT_ERROR'),
      timestamp: new Date().toISOString()
    };

    console.log('📊 PAYMENT_SUMMARY:', summary);
    return summary;
  }
}

// Export singleton instance
export const paymentLogger = PaymentLogger.getInstance();
