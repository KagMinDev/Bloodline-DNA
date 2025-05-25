using System.Collections.Generic;

namespace ADNTester.BO.DTOs
{
    public class UpdateTestServiceDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public bool IsActive { get; set; }
        public List<UpdatePriceServiceDto> PriceServices { get; set; }
    }
} 