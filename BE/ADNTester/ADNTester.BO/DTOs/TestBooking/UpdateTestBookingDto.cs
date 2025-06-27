using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class UpdateTestBookingDto
    {
        public string Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public BookingStatus Status { get; set; }
        public string Note { get; set; }
        public string ClientName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
    }
} 