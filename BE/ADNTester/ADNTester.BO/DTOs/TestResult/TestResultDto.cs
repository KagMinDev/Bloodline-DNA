using System;

namespace ADNTester.BO.DTOs.TestResult
{
    public class TestResultDto
    {
        public string TestBookingId { get; set; }
        public string ResultSummary { get; set; }
        public DateTime ResultDate { get; set; }
        public string ResultFileUrl { get; set; }
    }
} 