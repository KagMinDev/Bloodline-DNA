using System;

namespace ADNTester.BO.DTOs.TestResult
{
    public class UpdateTestResultDto
    {
        public string Id { get; set; }
        public string TestBookingId { get; set; }
        public string ResultSummary { get; set; }
        public DateTime ResultDate { get; set; }
        public string ResultFileUrl { get; set; }
    }
} 