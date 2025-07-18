﻿using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Payment
{
    public class CreatePaymentDto
    {
        [Required]
        public long OrderCode { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        public decimal? DepositAmount { get; set; }

        public decimal? RemainingAmount { get; set; }

        public string? Description { get; set; }

        [Required]
        public string BookingId { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    }
}
