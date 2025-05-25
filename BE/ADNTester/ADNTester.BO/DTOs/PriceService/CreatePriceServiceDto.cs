using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs
{
    public class CreatePriceServiceDto
    {
        public decimal Price { get; set; }
        public SampleCollectionMethod CollectionMethod { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public bool IsActive { get; set; }
    }
} 