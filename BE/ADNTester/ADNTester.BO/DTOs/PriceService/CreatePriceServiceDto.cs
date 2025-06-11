using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs
{
    public class CreatePriceServiceDto
    {
        public decimal Price { get; set; }
        public SampleCollectionMethod CollectionMethod { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; }
    }
} 