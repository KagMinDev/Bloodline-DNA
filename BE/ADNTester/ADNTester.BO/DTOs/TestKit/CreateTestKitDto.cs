using System;

namespace ADNTester.BO.DTOs.TestKit
{
    public class CreateTestKitDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Manufacturer { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string BookingId { get; set; }
        public string Note { get; set; }
    }
} 