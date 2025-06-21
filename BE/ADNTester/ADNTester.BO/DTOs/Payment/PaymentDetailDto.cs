using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.DTOs.User;
using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs.Payment
{
    public class PaymentDetailDto
    {
        public string Id { get; set; }
        public long OrderCode { get; set; }
        public decimal Amount { get; set; }
        public decimal? DepositAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime? PaidAt { get; set; }
        public string Description { get; set; }
        public string BookingId { get; set; }
        
        // Thông tin booking chi tiết
        public TestBookingDetailDto Booking { get; set; }
        
        // Thông tin user
        public UserDto User { get; set; }
        
        // Thông tin thời gian
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 