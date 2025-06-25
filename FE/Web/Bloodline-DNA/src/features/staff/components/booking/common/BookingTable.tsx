"use client";
import React, { useState } from "react";
import { BsCalendarXFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import type { TestBookingResponse } from "../../../types/testBooking";
import { type StatusOption } from "../constants/statusMapping";
import { getStatusLabel, renderCollectionMethod } from "../utils/statusUtils";
import StatusSelect from "./StatusSelect";

interface BookingTableProps {
  selectedDay: string;
  filteredBookings: TestBookingResponse[];
  selectedStatuses: Record<string, string>;
  statusOptions: StatusOption[];
  setSelectedStatuses: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  handleUpdateStatus: (bookingId: string) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  selectedDay,
  filteredBookings,
  selectedStatuses,
  statusOptions,
  setSelectedStatuses,
  handleUpdateStatus,
}) => {
  const [loadingBookings, setLoadingBookings] = useState<Set<string>>(
    new Set()
  );
  console.log("Booking in booking table:", filteredBookings);

  const handleClickUpdate = async (bookingId: string) => {
    setLoadingBookings((prev) => new Set(prev).add(bookingId));
    try {
      await handleUpdateStatus(bookingId);
    } finally {
      setLoadingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="pb-1 mb-2 text-base font-semibold text-blue-600 border-b-2 border-blue-600">
        Lịch hẹn trong ngày {selectedDay}
      </div>
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center py-8 italic text-center">
          <BsCalendarXFill className="mb-4 text-6xl text-gray-200" />
          <div className="mt-2 text-gray-400">Không có lịch hẹn</div>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-blue-700 bg-blue-50">
              <th className="px-2 py-2 text-left">Khách hàng</th>
              <th className="px-2 py-2 text-left">Giờ</th>
              <th className="px-2 py-2 text-left">Phương thức</th>
              <th className="px-2 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => {
              const currentStatusLabel = getStatusLabel(booking.status);
              const isLoading = loadingBookings.has(booking.id);
              console.log("Booking", booking);

              return (
                <tr key={booking.id} className="border-b">
                  <td className="px-2 py-1">
                    {booking.email || "Không có email"}
                  </td>
                  <td className="px-2 py-1">
                    {new Date(booking.bookingDate).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-2 py-1">
                    {renderCollectionMethod(booking.collectionMethod)}
                  </td>
                  <td className="flex items-center gap-2 px-2 py-1">
                    <StatusSelect
                      value={selectedStatuses[booking.id] || currentStatusLabel}
                      options={statusOptions.map((option) => option.label)}
                      onChange={(value) =>
                        setSelectedStatuses((prev) => ({
                          ...prev,
                          [booking.id]: value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => handleClickUpdate(booking.id)}
                      disabled={
                        isLoading ||
                        !selectedStatuses[booking.id] ||
                        selectedStatuses[booking.id] === currentStatusLabel
                      }
                      className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 shadow-md
                        ${
                          isLoading ||
                          !selectedStatuses[booking.id] ||
                          selectedStatuses[booking.id] === currentStatusLabel
                            ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
                        }`}
                      title="Cập nhật trạng thái"
                    >
                      {isLoading ? (
                        <svg
                          className="w-4 h-4 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <FaCheck className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingTable;
