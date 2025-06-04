using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs
{
    public class TestServicePriceDto
    {
        public string Id { get; set; }
        public string ServiceId { get; set; }
        public decimal Price { get; set; }
        public SampleCollectionMethod CollectionMethod { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
    }

    public class CreatetServicePriceDto
    {
        public string ServiceId { get; set; }
        public decimal Price { get; set; }
        public string CollectionMethod { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
    }

    public class UpdateServicePriceDto
    {
        public string Id { get; set; }
        public string ServiceId { get; set; }
        public decimal Price { get; set; }
        public string CollectionMethod { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
    }
} 