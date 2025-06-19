using System;
using System.Collections.Generic;

namespace ADNTester.BO.DTOs
{
    public class TestServiceDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<PriceServiceDto> PriceServices { get; set; }
        public int SampleCount { get; set; }
    }
} 