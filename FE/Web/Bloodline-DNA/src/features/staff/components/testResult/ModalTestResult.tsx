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
    resultFile: File | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (file: File | null) => void;
  bookingOptions: BookingOption[];
  isLoadingBookings: boolean;
}

const ModalTestResult: React.FC<ModalTestResultProps> = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  onFileChange,
  bookingOptions,
  isLoadingBookings,
}) => {
  useEffect(() => {
    if (!form.resultDate) {
      const today = new Date().toISOString().split("T")[0];
      const fakeEvent = {
        target: {
          name: "resultDate",
          value: today,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(fakeEvent);
    }
  }, [form.resultDate, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

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
              placeholder="YYYY-MM-DD"
              type="date"
              name="resultDate"
              value={form.resultDate}
              onChange={onChange}
              required
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              File kết quả xét nghiệm
            </label>
            <input
              placeholder="Tải file kết quả"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.resultFile && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">File đã chọn:</span> {form.resultFile.name}
                <span className="ml-2 text-xs text-gray-500">
                  ({(form.resultFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">
              Chấp nhận: PDF, DOC, DOCX, JPG, JPEG, PNG (tối đa 10MB)
            </div>
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