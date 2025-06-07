using System;
using ADNTester.BO.DTOs.TestBooking;

namespace ADNTester.BO.DTOs.TestKit
{
    public class TestKitDetailDto
    {
        public string Id { get; set; }
        public string BookingId { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? SentToLabAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
        public string Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public TestBookingDetailDto Booking { get; set; }
    }
} 