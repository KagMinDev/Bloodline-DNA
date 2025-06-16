using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class OtpCode : BaseEntity
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string HashedCode { get; set; }

        [Required]
        public OtpDeliveryMethod DeliveryMethod { get; set; } // Email or SMS

        [Required]
        public OtpPurpose Purpose { get; set; } // e.g., ResetPassword, VerifyAccount

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public string? SentTo { get; set; } // email or phone number
    }
}
