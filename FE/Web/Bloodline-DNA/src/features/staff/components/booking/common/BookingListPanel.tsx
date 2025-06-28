import React from "react";
import { BsCalendarXFill } from "react-icons/bs";
import type { TestBookingResponse } from "../../../types/testBooking";
import { getStatusColor } from "../constants/statusMapping";
import { getStatusLabel, renderCollectionMethod } from "../utils/statusUtils";

interface BookingListPanelProps {
  selectedDay: string;
  bookings: TestBookingResponse[];
  statusOptions: string[];
}

const BookingListPanel: React.FC<BookingListPanelProps> = ({
  selectedDay,
  bookings,
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-white shadow-lg rounded-xl">
      <div className="pt-6 pb-3 text-lg font-semibold text-center text-blue-600 border-b-2 border-blue-600">
        Danh sách đặt lịch ngày {selectedDay}
      </div>
      <div className="flex-1 h-full px-5 py-4 space-y-4 overflow-y-auto">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full italic text-center text-gray-400">
            <BsCalendarXFill className="mb-4 text-gray-200 text-8xl" />
            <div>Không có đặt lịch nào</div>
          </div>
        ) : (
          bookings.map((booking) => {
            const statusLabel = getStatusLabel(booking.status);
            return (
              <div
                key={booking.id}
                className="p-4 transition-shadow border border-gray-200 shadow-sm rounded-xl hover:shadow-md bg-gray-50"
              >
                <div className="text-xs">Email: {booking.email}</div>
                <div className="mb-3 text-xs text-gray-400">
                  Đặt lúc: {new Date(booking.createdAt).toLocaleString("vi-VN")}
                </div>
                <div className="grid grid-cols-1 text-sm text-gray-600 gap-y-1">
                  <div>
                    Phương thức:{" "}
                    <span className="font-medium">
                      {renderCollectionMethod(booking.collectionMethod)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    Trạng thái:
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <div>Giá: {booking.price?.toLocaleString() || "0"} VNĐ</div>
                  <div>Ghi chú: {booking.note || "Không có"}</div>
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
