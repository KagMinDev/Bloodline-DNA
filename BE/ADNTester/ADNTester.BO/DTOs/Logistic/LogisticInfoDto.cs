using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.Logistic
{
    public class LogisticsInfoDto
    {
        public string Id { get; set; }
        public string? StaffId { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Note { get; set; }

        // Trả về tên Enum dưới dạng chuỗi
        public string Type { get; set; }
        public string Status { get; set; }
    }
}
