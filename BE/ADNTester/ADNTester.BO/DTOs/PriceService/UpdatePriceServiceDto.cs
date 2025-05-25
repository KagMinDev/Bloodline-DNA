using System;

namespace ADNTester.BO.DTOs
{
    public class UpdatePriceServiceDto
    {
        public string Id { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public bool IsActive { get; set; }
    }
} 