import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Calendar from "../components/common/Calendar";
import type { TestBookingResponse } from "../types/testBooking";
import { getTestBookingApi } from "../api/testBookingApi";

function TestBooking() {
  const [bookings, setBookings] = useState<TestBookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getTestBookingApi(token);
        console.log("API Response:", response);
        
        // Kiểm tra dữ liệu trả về
        if (!Array.isArray(response)) {
          console.error("Dữ liệu không phải mảng:", response);
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
        
        setBookings(response);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError(error instanceof Error ? error.message : "Lỗi không xác định");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token]);


  // Hàm đếm booking theo ngày
   const countBookingsByDate = (bookings: TestBookingResponse[]) => {
    const counts: Record<string, number> = {};
    
    bookings.forEach(booking => {
      try {
        const date = new Date(booking.bookingDate);
        // Kiểm tra ngày hợp lệ
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0];
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        }
      } catch (e) {
        console.warn("Invalid booking date:", booking.bookingDate);
      }
    });
    
    return counts;
  };

  const bookingsByDate = countBookingsByDate(bookings);
  console.log("Bookings by date:", bookingsByDate);


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
        {error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Calendar 
            events={bookings} 
            onUpdateStatus={handleUpdateStatus} 
            bookingsByDate={bookingsByDate}
          />
        )}
      </div>
    </div>
  );
}

export default TestBooking;