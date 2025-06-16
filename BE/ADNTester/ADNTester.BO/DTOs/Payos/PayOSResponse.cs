using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Payos
{
    public class PayOSResponse
    {
        public int Code { get; set; }
        public string Desc { get; set; }
        public PayOSData Data { get; set; }
        public string Signature { get; set; }
    }


    public class PayOSData
    {
        public string PaymentUrl { get; set; }
        public string QrCode { get; set; }
        public string CheckoutUrl { get; set; }
        public string PaymentId { get; set; }
        public string Status { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; }
        public string CancelUrl { get; set; }
        public string ReturnUrl { get; set; }
        public string ExpiredAt { get; set; }
        public string OrderCode { get; set; }
        public string BuyerName { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerPhone { get; set; }
        public string BuyerAddress { get; set; }
    }
}
