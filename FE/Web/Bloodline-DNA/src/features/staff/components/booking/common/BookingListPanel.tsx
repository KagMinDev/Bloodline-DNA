'use client';
import React from 'react';
import { BsCalendarXFill } from 'react-icons/bs';
import type { TestBookingResponse } from '../../../types/testBooking';
import { getStatusLabel, renderCollectionMethod } from '../utils/statusUtils';
import { getStatusColor } from '../constants/statusMapping';

interface BookingListPanelProps {
  selectedDay: string;
  bookings: TestBookingResponse[];
  selectedStatus: Record<string, string>; // Fixed to match usage
  statusOptions: string[];
  setSelectedStatus: (bookingId: string, value: string) => void;
}

const BookingListPanel: React.FC<BookingListPanelProps> = ({
  selectedDay,
  bookings,
}) => {
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
            console.log('Booking status:', booking.status);
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
                    Phương thức: <span className="font-medium">{renderCollectionMethod(booking.collectionMethod)}</span>
                  </div>
                  <div className="flex items-center">
                    Trạng thái:{' '}
                    <span
                      className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {statusLabel}
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