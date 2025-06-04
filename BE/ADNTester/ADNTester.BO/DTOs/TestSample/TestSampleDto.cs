using System;
using ADNTester.BO.Enums;

namespace ADNTester.BO.DTOs.TestSample
{
    public class TestSampleDto
    {
        public string Id { get; set; }
        public string KitId { get; set; }
        public string SampleCode { get; set; }
        public string DonorName { get; set; }
        public string RelationshipToSubject { get; set; }
        public string SampleType { get; set; }
        public string CollectedById { get; set; }
        public DateTime? CollectedAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 