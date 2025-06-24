using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class CreateTestBookingDto
    {
        public string TestServiceId { get; set; }
        public string ClientId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Note { get; set; }
    }
} 