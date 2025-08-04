import React from "react";

interface Client {
  fullName: string;
  email: string;
  address: string;
}

interface TestResultDetail {
  testBookingId: string;
  resultSummary: string;
  resultDate: string;
  resultFileUrl?: string;
  client?: Client;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  result: TestResultDetail | null;
}

const ModalTestResultDetail: React.FC<Props> = ({ show, onClose, result }) => {
  if (!show || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-blue-800">Chi tiết kết quả xét nghiệm</h2>

        <div className="space-y-2 text-sm">
          <p><strong>Mã đặt xét nghiệm:</strong> {result.testBookingId}</p>
          <p><strong>Tóm tắt kết quả:</strong> {result.resultSummary}</p>
          <p><strong>Ngày trả:</strong> {new Date(result.resultDate).toLocaleDateString("vi-VN")}</p>

          {result.resultFileUrl && (
            <p>
              <strong>File:</strong>{" "}
              <a href={result.resultFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Xem file
              </a>
            </p>
          )}

          {result.client && (
            <>
              <p><strong>Khách hàng:</strong> {result.client.fullName}</p>
              <p><strong>Email:</strong> {result.client.email}</p>
              <p><strong>Địa chỉ:</strong> {result.client.address}</p>
            </>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} style={{ color: "white" }} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTestResultDetail;
