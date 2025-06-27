using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class TestBookingDto
    {
        public string Id { get; set; }
        public string TestServiceId { get; set; }
        public string ClientId { get; set; }
        public string Email { get; set; }
        public DateTime AppointmentDate { get; set; }
        public decimal Price { get; set; }
        public string CollectionMethod { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
         public string ClientName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
    }
} 