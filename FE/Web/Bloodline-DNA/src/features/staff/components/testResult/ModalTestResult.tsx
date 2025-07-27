import React, { useEffect } from "react";

interface BookingOption {
  id: string;
  clientName: string;
  email: string;
  appointmentDate: string;
  status: string;
}

interface ModalTestResultProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    testBookingId: string;
    resultSummary: string;
    resultDate: string;
    resultFileUrl: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  bookingOptions: BookingOption[];
  isLoadingBookings: boolean;
}

const ModalTestResult: React.FC<ModalTestResultProps> = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  bookingOptions,
  isLoadingBookings,
}) => {
  useEffect(() => {
  }, [bookingOptions]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tạo kết quả xét nghiệm</h2>
          <button
            onClick={onClose}
            className="text-xl leading-none text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5 text-sm">
          {/* Booking select */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tạo kết quả cho:
            </label>
            {isLoadingBookings ? (
              <div className="text-gray-500">Đang tải danh sách...</div>
            ) : (
              <select
                name="testBookingId"
                value={form.testBookingId}
                onChange={(e) => {
                  console.log("User chọn booking ID:", e.target.value);
                  onChange(e);
                }}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn --</option>
                {bookingOptions
                .filter((booking) => booking.status === "Testing")
                .map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.clientName} - {booking.id.slice(-6)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Result Summary */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tóm tắt kết quả
            </label>
            <textarea
              name="resultSummary"
              value={form.resultSummary}
              onChange={onChange}
              placeholder="Mô tả ngắn gọn kết quả xét nghiệm"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Result Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Ngày trả kết quả
            </label>
            <input
              type="date"
              name="resultDate"
              value={form.resultDate}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File URL */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Đường dẫn file kết quả
            </label>
            <input
              type="url"
              name="resultFileUrl"
              value={form.resultFileUrl}
              onChange={onChange}
              placeholder="https://example.com/result.pdf"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <span className="text-white">Tạo kết quả</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTestResult;
