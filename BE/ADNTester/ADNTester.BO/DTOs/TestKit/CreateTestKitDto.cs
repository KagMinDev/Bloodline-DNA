using System;

namespace ADNTester.BO.DTOs.TestKit
{
    public class CreateTestKitDto
    {
        public string BookingId { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? SentToLabAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
        public string? Note { get; set; }
        public int SampleCount { get; set; }
        public string? DeliveryInfoId { get; set; }
        public ADNTester.BO.Enums.SampleCollectionMethod CollectionMethod { get; set; }
    }
} 