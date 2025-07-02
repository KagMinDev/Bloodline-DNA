using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Enums
{
    public enum BookingStatus
    {
        Pending = 0,                // chờ
        PreparingKit = 1,           // chuẩn bị kit test để giao hàng
        DeliveringKit = 2,          // Staff đang giao kit test
        KitDelivered = 3,           // Client nhận được kit test
        WaitingForSample = 4,       // đợi client lấy mẫu
        ReturningSample = 5,        // kit đang được staff lấy về
        SampleReceived = 6,         // Nhận được sample
        Testing = 7,                // đang kiểm tra sample
        Completed = 8,              // hoàn thành có Test Result
        Cancelled = 9,              // bị hủy 
        StaffGettingSample = 10,    // staff lấy mẫu từ người dùng tại cơ sở
        CheckIn = 11,               // client check in với staff và trả tiền dịch vụ đã đặt trước
    }
}
