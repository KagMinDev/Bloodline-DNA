using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Enums
{
    public enum LogisticStatus
    {
        PreparingKit = 0,        // Đang chuẩn bị bộ kit
        DeliveringKit = 1,       // Đang giao bộ kit đến client
        KitDelivered = 2,        // Client đã nhận bộ kit
        WaitingForPickup = 3,    // Đợi staff đến lấy mẫu (từ client)
        PickingUpSample = 4,     // Staff đang lấy mẫu (hoặc nhận kit lại)
        SampleReceived = 5,      // Đã nhận được mẫu tại cơ sở
        Cancelled = 6            // Hủy giao hoặc lấy mẫu
    }
}
