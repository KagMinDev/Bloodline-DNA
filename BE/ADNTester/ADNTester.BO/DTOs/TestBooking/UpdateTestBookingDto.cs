using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class UpdateTestBookingDto
    {
        public string Id { get; set; }
        public DateTime BookingDate { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }
} 