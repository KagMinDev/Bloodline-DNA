using System;

namespace ADNTester.BO.DTOs.TestKit
{
    public class UpdateTestKitDto
    {
        public string Id { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? SentToLabAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
        public string Note { get; set; }
    }
} 