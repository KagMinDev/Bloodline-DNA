using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace ADNTester.BO.Entities
{
    public class Payment : BaseEntity
    {
        [Required]
        public long OrderCode { get; set; } // Mã đơn hàng duy nhất nhận từ PayOS

        [Required]
        public decimal Amount { get; set; } // Tổng tiền cần thanh toán

        public decimal? DepositAmount { get; set; } // Nếu là cọc thì lưu giá trị cọc
        public decimal? RemainingAmount { get; set; } // Số còn lại cần trả

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public DateTime? PaidAt { get; set; }

        public string? Description { get; set; }

        // Liên kết với đơn dịch vụ xét nghiệm
        [Required]
        public string BookingId { get; set; }
        public TestBooking Booking { get; set; }
    }

}
