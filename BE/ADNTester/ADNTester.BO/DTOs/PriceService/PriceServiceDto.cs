using ADNTester.BO.Enums;
using System;

namespace ADNTester.BO.DTOs
{
    public class PriceServiceDto
    {
        public string Id { get; set; }
        public string TestServiceId { get; set; }
        public decimal Price { get; set; }
        public SampleCollectionMethod CollectionMethod { get; set; }
        public string Currency { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 