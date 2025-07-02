using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class CreateTestBookingDto
    {
        public string TestServiceId { get; set; }
        public string ClientId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Note { get; set; }
         public string? ClientName { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? PriceServiceId { get; set; }
    }
} 