using ADNTester.BO.DTOs.User;
using System;

namespace ADNTester.BO.DTOs.TestResult
{
    public class TestResultDetailDto
    {
        public string Id { get; set; }
        public string TestBookingId { get; set; }
        public string ResultSummary { get; set; }
        public DateTime ResultDate { get; set; }
        public string ResultFileUrl { get; set; }
        public UserDto Client { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 