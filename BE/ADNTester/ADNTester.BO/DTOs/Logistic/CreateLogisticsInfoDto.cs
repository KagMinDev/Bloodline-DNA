using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Logistic
{
    public class CreateLogisticsInfoDto
    {
        public string? StaffId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public string? Note { get; set; }
        public LogisticsType Type { get; set; } // Enum: Delivery or Pickup
    }

}
