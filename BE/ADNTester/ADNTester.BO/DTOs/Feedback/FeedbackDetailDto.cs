using ADNTester.BO.DTOs.User;
using System;

namespace ADNTester.BO.DTOs.Feedback
{
    public class FeedbackDetailDto
    {
        public string Id { get; set; }
        public string TestServiceId { get; set; }
        public string UserId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public UserDto User { get; set; }
        public TestServiceDto Service { get; set; }
    }
}