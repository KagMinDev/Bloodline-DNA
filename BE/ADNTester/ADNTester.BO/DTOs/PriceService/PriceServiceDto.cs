using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs
{
    public class PriceServiceDto
    {
        public string Id { get; set; }
        public string ServiceId { get; set; }
        public decimal Price { get; set; }
        public SampleCollectionMethod CollectionMethod { get; set; }
        public string Currency { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public TestServiceDto TestServiceInfor { get; set; }
    }
} 