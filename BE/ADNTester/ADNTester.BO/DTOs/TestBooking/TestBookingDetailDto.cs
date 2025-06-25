using ADNTester.BO.DTOs.User;
using System;

namespace ADNTester.BO.DTOs.TestBooking
{
    public class TestBookingDetailDto
    {
        public string Id { get; set; }
        public string TestServiceId { get; set; }
        public string ClientId { get; set; }
       
        public DateTime AppointmentDate { get; set; }
        public decimal Price { get; set; }
        public string CollectionMethod { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public UserDto Client { get; set; }
        public TestServiceDto TestService { get; set; }
    }
} 