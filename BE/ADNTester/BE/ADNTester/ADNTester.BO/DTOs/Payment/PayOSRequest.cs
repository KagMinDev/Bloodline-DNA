using System;
using System.Collections.Generic;

namespace ADNTester.BO.DTOs.Payment
{
    public class PayOSRequest
    {
        public string OrderCode { get; set; }
        public long Amount { get; set; }
        public string Description { get; set; }
        public string CancelUrl { get; set; }
        public string ReturnUrl { get; set; }
        public string ExpiredAt { get; set; }
        public string Signature { get; set; }
        public List<PayOSItem> Items { get; set; }
        public string BuyerName { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerPhone { get; set; }
        public string BuyerAddress { get; set; }
        public string PaymentMethodId { get; set; }
    }

    public class PayOSItem
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public long Price { get; set; }
    }
} 