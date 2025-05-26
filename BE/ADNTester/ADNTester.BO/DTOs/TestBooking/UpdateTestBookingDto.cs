using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class UpdateTestBookingDto
    {
        public string Id { get; set; }
        public DateTime BookingDate { get; set; }
        public BookingStatus Status { get; set; }
        public string Note { get; set; }
    }
} 