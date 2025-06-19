using ADNTester.BO.Enums;
using System.Collections.Generic;

namespace ADNTester.BO.DTOs
{
    public class CreateTestServiceDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public TestServiceType Type { get; set; }
        public bool IsActive { get; set; }
        public int SampleCount { get; set; }
        public List<CreatePriceServiceDto> PriceServices { get; set; }
    }
}