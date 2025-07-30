using ADNTester.BO.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Entities
{
    public class LogisticsInfo
    {
        [Key]
        public string Id { get; set; } = GenerateUniqueId();

        public string? StaffId { get; set; }
        public User? Staff { get; set; }

        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }

        public DateTime? ScheduledAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        public string? Note { get; set; }
        public string? EvidenceImageUrl { get; set; }


        // Optional: add a discriminator if needed
        public LogisticsType Type { get; set; } // Enum: Delivery or Pickup
        public LogisticStatus Status { get; set; }

        private static string GenerateUniqueId()
        {
            var ticks = new DateTime(2025, 4, 30).Ticks;
            var ans = DateTime.Now.Ticks - ticks;
            var randomPart = new Random().Next(1000, 9999);
            return (ans.ToString("x") + randomPart.ToString()).ToUpper();
        }
    }
}
