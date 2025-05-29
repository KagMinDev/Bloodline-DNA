using System;

namespace ADNTester.BO.DTOs.TestResult
{
    public class CreateTestResultDto
    {
       
        public string id { get; set; }
        public string TestBookingId { get; set; }
        public string ResultSummary { get; set; }
        public DateTime ResultDate { get; set; }
        public string ResultFileUrl { get; set; }
    }
} 