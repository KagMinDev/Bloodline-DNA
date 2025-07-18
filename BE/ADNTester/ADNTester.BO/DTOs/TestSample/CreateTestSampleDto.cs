using System;
using ADNTester.BO.Enums;

namespace ADNTester.BO.DTOs.TestSample
{
    public class CreateTestSampleDto
    {
        public string KitId { get; set; }
        public string DonorName { get; set; }
        public RelationshipToSubject RelationshipToSubject { get; set; }
        public SampleType SampleType { get; set; }
        public string CollectedById { get; set; }
        public DateTime? CollectedAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
    }
} 