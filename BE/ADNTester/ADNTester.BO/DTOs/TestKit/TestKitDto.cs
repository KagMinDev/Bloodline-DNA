using ADNTester.BO.DTOs.TestSample;
using ADNTester.BO.Entities;
using System;
using System.Collections.Generic;

namespace ADNTester.BO.DTOs.TestKit
{
    public class TestKitDto
    {
        public string Id { get; set; }
        public string BookingId { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? SentToLabAt { get; set; }
        public DateTime? LabReceivedAt { get; set; }
        public string Note { get; set; }
        public ICollection<TestSampleDto> Samples { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int SampleCount { get; set; }
        public string? PickupInfoId { get; set; }
        public string? DeliveryInfoId { get; set; }
    }
} 