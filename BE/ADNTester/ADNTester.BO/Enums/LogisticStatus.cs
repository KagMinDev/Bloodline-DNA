using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Enums
{
    public enum LogisticStatus
    {
        Pending = 0,             // Default state (chờ xử lý)
        PreparingKit = 1,        // Đang chuẩn bị bộ kit
        DeliveringKit = 2,       // Đang giao bộ kit đến client
        KitDelivered = 3,        // Client đã nhận bộ kit
        WaitingForPickup = 4,    // Đợi staff đến lấy mẫu (từ client)
        PickingUpSample = 5,     // Staff đang lấy mẫu (hoặc nhận kit lại)
        SampleReceived = 6,      // Đã nhận được mẫu tại cơ sở
        Cancelled = 7            // Hủy giao hoặc lấy mẫu
    }
}
