import { useState } from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "../../staff/components/booking/ui/dialog";
import { Button } from "./ui/Button";

interface CollectionTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateTime: string) => void;
  isLoading?: boolean;
}

export const CollectionTimeModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CollectionTimeModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn đầy đủ ngày và giờ");
      return;
    }

    // Format datetime theo yêu cầu: "Ngày 12/07/2025 lúc 8:15"
    const [year, month, day] = selectedDate.split('-');
    const [hour, minute] = selectedTime.split(':');
    const formattedDateTime = `Ngày ${day}/${month}/${year} lúc ${hour}:${minute}`;
    
    console.log("🕒 Selected DateTime:", {
      date: selectedDate,
      time: selectedTime,
      formatted: formattedDateTime
    });

    onConfirm(formattedDateTime);
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedTime("");
    onClose();
  };

  // Get date range (today to 5 days from now)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 5);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  // Get minimum time if selected date is today
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const minTime = selectedDate === minDate ? currentTime : "08:00";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">
            Đặt Lịch Lấy Mẫu
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Chọn thời gian phù hợp để nhân viên đến lấy mẫu
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                </div>
                Chọn ngày
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDateString}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              <p className="text-xs text-gray-500">
                Trong vòng 5 ngày tới
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <ClockIcon className="w-4 h-4 text-green-600" />
                </div>
                Chọn giờ
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                min={minTime}
                max="17:00"
                step="900" // 15 minutes
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              <p className="text-xs text-gray-500">
                8:00 - 17:00 (mỗi 15 phút)
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-800 text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Lưu ý quan trọng
                </p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Nhân viên sẽ liên hệ với bạn trước khi đến lấy mẫu khoảng 30 phút. 
                  Vui lòng chuẩn bị sẵn mẫu xét nghiệm.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            className="!text-white !bg-blue-900"
            disabled={isLoading || !selectedDate || !selectedTime}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-white" />
                <span className="text-white">Xác nhận đặt lịch</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 