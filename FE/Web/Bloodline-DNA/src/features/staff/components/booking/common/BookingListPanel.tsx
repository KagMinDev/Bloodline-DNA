import React from 'react';
import { BsCalendarXFill } from 'react-icons/bs';
import type { TestBookingResponse } from '../../../types/testBooking';
import { STATUS_MAPPING } from '../utils/statusmapping';
import { getStatusColor } from '../utils/statusColor';

interface BookingListPanelProps {
  selectedDay: string;
  bookings: TestBookingResponse[];
  selectedStatus: Record<string, string>;
  statusOptions: string[];
  setSelectedStatus: (bookingId: string, value: string) => void;
}

const BookingListPanel: React.FC<BookingListPanelProps> = ({
  selectedDay,
  bookings,
}) => {
  // Function to convert status to numeric value
  const statusToNumber = (status: string | number): number => {
    if (typeof status === 'number') {
      return status; // Return as-is if already a number
    }
    // Map API string statuses to numeric values
    const statusMap: Record<string, number> = {
      Pending: 0, // Chờ xử lý
      SentKit: 1, // Đã gửi kit
      Confirmed: 2, // Đã xác nhận
      Completed: 3, // Đã hoàn tất
      Cancelled: 4, // Đã huỷ
      SampleReceived: 5, // Đã nhận mẫu
      Testing: 6, // Đang xét nghiệm
    };
    return statusMap[status] !== undefined ? statusMap[status] : -1; // Fallback to -1 for unknown statuses
  };

  // Function to get status label
  const getStatusLabel = (statusValue: string | number) => {
    const numericValue = typeof statusValue === 'number' ? statusValue : statusToNumber(statusValue);
    const status = STATUS_MAPPING.find((item: any) => item.value === numericValue);
    return status ? status.label : 'Không xác định';
  };

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-white shadow-lg">
      <div className="text-center pt-6 pb-3 border-b-2 border-blue-600 text-lg font-semibold text-blue-600">
        Danh sách đặt lịch ngày {selectedDay}
      </div>
      <div className="h-full flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 italic">
            <BsCalendarXFill className="text-8xl text-gray-200 mb-4" />
            <div>Không có đặt lịch nào</div>
          </div>
        ) : (
          bookings.map((booking) => {
            console.log('Booking status:', booking.status); // Debug status value
            const statusLabel = getStatusLabel(booking.status);
            return (
              <div
                key={booking.id}
                className="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="items-start mb-2">
                  <div className="text-xs">Email: {booking.email}</div>
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}
                </div>
                <div className="grid grid-cols-1 gap-y-1 text-sm text-gray-600">
                  <div>
                    Phương thức: <span className="font-medium">{booking.collectionMethod}</span>
                  </div>
                  <div className="flex items-center">
                    Trạng thái:{' '}
                    <span
                      className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {statusLabel} {/* Use statusLabel instead of booking.status */}
                    </span>
                  </div>
                  <div>Giá: {booking.price?.toLocaleString() || '0'} VNĐ</div>
                  <div>Ghi chú: {booking.note || 'Không có'}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookingListPanel;