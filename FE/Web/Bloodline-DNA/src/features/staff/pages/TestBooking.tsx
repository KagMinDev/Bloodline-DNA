import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Calendar from "../components/common/Calendar";
import type { TestBookingResponse } from "../types/testBooking";
import { getTestBookingApi } from "../api/testBookingApi";

// Dữ liệu giả (điều chỉnh bookingDate để khớp với ngày hiện tại)
const mockTestBookings: TestBookingResponse[] = [
  {
    id: "BK001",
    testServiceId: "TS001",
    clientId: "CL001",
    email: "khachhang1@gmail.com",
    bookingDate: "2025-06-19T08:00:00.000Z", // Đổi thành hôm nay
    price: 500000,
    collectionMethod: "Tại nhà",
    status: "Đã xác nhận",
    note: "Lấy mẫu buổi sáng",
    createdAt: "2025-06-18T10:00:00.000Z",
    updatedAt: "2025-06-18T12:00:00.000Z",
  },
  {
    id: "BK002",
    testServiceId: "TS002",
    clientId: "CL002",
    email: "khachhang2@gmail.com",
    bookingDate: "2025-06-19T14:30:00.000Z", // Đổi thành hôm nay
    price: 700000,
    collectionMethod: "Tại trung tâm",
    status: "Chờ xác nhận",
    note: "",
    createdAt: "2025-06-18T09:00:00.000Z",
    updatedAt: "2025-06-18T09:00:00.000Z",
  },
];

function TestBooking() {
  const [bookings, setBookings] = useState<TestBookingResponse[]>(mockTestBookings);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getTestBookingApi(token);
        console.log("API data:", data); // Log dữ liệu API
        // Nếu API trả về mảng rỗng, sử dụng mock data
        setBookings(data.length > 0 ? data : mockTestBookings);
      } catch (error) {
        console.error("Error fetching test bookings:", error);
        // Sử dụng mock data nếu API lỗi
        setBookings(mockTestBookings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  console.log("Bookings state:", bookings); // Log state bookings

  const handleUpdateStatus = (updatedBooking: TestBookingResponse) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  return (
    <div className="h-screen bg-blue-50">
      <div className="flex h-[8%] items-center justify-between bg-white px-10">
        <span className="text-xl font-bold text-[#1F2B6C]">
          Quản lí đơn xét nghiệm
        </span>
        <div className="rounded-full bg-blue-200 p-3 text-base text-[#1F2B6C]">
          <FaBell />
        </div>
      </div>
      <div className="h-[92%]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Calendar events={bookings} onUpdateStatus={handleUpdateStatus} />
        )}
      </div>
    </div>
  );
}

export default TestBooking;