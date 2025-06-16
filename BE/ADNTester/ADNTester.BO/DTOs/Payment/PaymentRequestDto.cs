using System.ComponentModel.DataAnnotations;

namespace ADNTester.BO.DTOs.Payment
{
    public class PaymentRequestDto
    {
        [Required]
        public string BookingId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
    }
} 