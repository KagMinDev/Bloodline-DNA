using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Payment
{
    public class PaymentDto
    {
        public string Id { get; set; }

        public long OrderCode { get; set; }

        public decimal Amount { get; set; }

        public decimal? DepositAmount { get; set; }

        public decimal? RemainingAmount { get; set; }

        public PaymentStatus Status { get; set; }

        public DateTime? PaidAt { get; set; }

        public string? Description { get; set; }

        public string BookingId { get; set; }
    }
}
