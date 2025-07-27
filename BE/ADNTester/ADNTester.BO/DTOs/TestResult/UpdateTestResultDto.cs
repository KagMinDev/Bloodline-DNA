using System;
using Microsoft.AspNetCore.Http;

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

    public class UpdateTestResultWithFileDto
    {
        public string Id { get; set; }
        public string TestBookingId { get; set; }
        public string ResultSummary { get; set; }
        public DateTime ResultDate { get; set; }
        public IFormFile ResultFile { get; set; }
    }
} 