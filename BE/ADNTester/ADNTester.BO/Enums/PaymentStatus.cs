using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Enums
{
    public enum PaymentStatus
    {
        Pending = 0,     // Chưa thanh toán
        Deposited = 1,   // Đã đặt cọc
        Paid = 2,        // Đã thanh toán toàn bộ
        Failed = 3,      // Thanh toán thất bại
        Refunded = 4,    // Đã hoàn tiền
        Canceled = 5,     // Đã hủy
        Cancelled = 6    // Đã hủy
    }
}
