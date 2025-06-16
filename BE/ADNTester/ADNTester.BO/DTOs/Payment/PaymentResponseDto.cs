using System;

namespace ADNTester.BO.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public string Id { get; set; }
        public string OrderCode { get; set; }
        public decimal Amount { get; set; }
        public decimal DepositAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public int Status { get; set; }
        public DateTime? PaidAt { get; set; }
        public string Description { get; set; }
        public string BookingId { get; set; }
        public string PaymentUrl { get; set; }
        public string QrCode { get; set; }
    }
} 