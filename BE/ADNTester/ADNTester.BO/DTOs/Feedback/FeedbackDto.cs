using System;

namespace ADNTester.BO.DTOs
{
    public class FeedbackDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string TestServiceId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 