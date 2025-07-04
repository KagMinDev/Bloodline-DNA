using System;

namespace ADNTester.BO.DTOs
{
    public class UpdatePriceServiceDto
    {
        public string Id { get; set; }
        public decimal Price { get; set; }
       
        public DateTime EffectiveFrom { get; set; } 

        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; }
    }
} 