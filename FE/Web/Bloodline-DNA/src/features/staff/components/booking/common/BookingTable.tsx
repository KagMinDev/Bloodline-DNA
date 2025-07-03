// ✅ BookingTable.tsx
import React, { useState } from "react";
import { BsCalendarXFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import type { TestBookingResponse } from "../../../types/testBooking";
import { type StatusOption } from "../constants/statusMapping";
import { getStatusLabel, renderCollectionMethod } from "../utils/statusUtils";
import StatusSelect from "./StatusSelect";
import { updateTestBookingStatusApi } from "../../../api/testBookingApi";

interface BookingTableProps {
  selectedDay: string;
  filteredBookings: TestBookingResponse[];
  selectedStatuses: Record<string, string>;
  statusOptions: StatusOption[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFilteredBookings: React.Dispatch<React.SetStateAction<TestBookingResponse[]>>;
  token: string;
  refetchBookings: () => Promise<void>;
}

const BookingTable: React.FC<BookingTableProps> = ({
  selectedDay,
  filteredBookings,
  selectedStatuses,
  statusOptions,
  setSelectedStatuses,
  token,
  refetchBookings,
}) => {
  const [loadingBookings, setLoadingBookings] = useState<Set<string>>(new Set());

  const handleClickUpdate = async (bookingId: string) => {
    const newStatusLabel = selectedStatuses[bookingId];
    const statusOption = statusOptions.find((s) => s.label === newStatusLabel);
    if (!statusOption) {
      toast.error("Trạng thái không hợp lệ");
      return;
    }

    setLoadingBookings((prev) => new Set(prev).add(bookingId));
    try {
      await updateTestBookingStatusApi({ bookingId, status: statusOption.value }, token);
      await refetchBookings();

      setSelectedStatuses((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });

      toast.success(`Đã cập nhật trạng thái thành: ${newStatusLabel}`);
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoadingBookings((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  const getAvailableStatusOptions = (
    collectionMethod: string,
    currentStatus: string
  ): string[] => {
    const facilityStatusLabels = [
      "Chờ xử lý",
      "Đã nhận mẫu",
      "Nhân viên đang lấy mẫu",
      "Đang xét nghiệm",
      "Hoàn tất",
      "Đã huỷ",
    ];

    const fullLabels = statusOptions.map((s) => s.label);
    const statusList = collectionMethod === "AtFacility" ? facilityStatusLabels : fullLabels;

    const currentIndex = statusList.indexOf(currentStatus);
    return currentIndex >= 0 ? statusList.slice(currentIndex) : statusList;
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
              const collectionMethod = booking.collectionMethod;
              const options = getAvailableStatusOptions(collectionMethod, currentStatusLabel);

              return (
                <tr key={booking.id} className="border-b">
                  <td className="px-2 py-1">{booking.email || "Không có email"}</td>
                  <td className="px-2 py-1">
                    {new Date(booking.appointmentDate).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-2 py-1">
                    {renderCollectionMethod(collectionMethod)}
                  </td>
                  <td className="flex items-center gap-2 px-2 py-1">
                    <StatusSelect
                      value={selectedStatuses[booking.id] || currentStatusLabel}
                      options={options}
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
